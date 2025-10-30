import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Coins, Calendar, ShoppingCart, Check, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/Loader';
import { photopayAPI } from '../utils/api';
import { toast } from 'sonner';
import { useWallet } from '../context/WalletContext';

export const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { walletAddress, isConnected, signAndSendTransaction } = useWallet();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [txData, setTxData] = useState(null);
  const [step, setStep] = useState('idle'); // idle, initiated, signing, confirming, success

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const { data } = await photopayAPI.getListingById(id);
      setListing(data);
    } catch (error) {
      console.error('Failed to load listing:', error);
      toast.error('Failed to load listing');
      navigate('/explore');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      // Step 1: Initiate purchase
      setStep('initiating');
      setPurchasing(true);
      
      const { data } = await photopayAPI.initiatePurchase({
        listing_id: id,
        buyer_wallet: walletAddress,
      });

      setTxData(data.transaction_data);
      setStep('initiated');
      
      toast.success('Transaction prepared!', {
        description: 'Review the details below',
      });

    } catch (error) {
      console.error('Failed to initiate purchase:', error);
      const message = error.response?.data?.detail || 'Failed to initiate purchase';
      toast.error(message);
      setStep('idle');
      setPurchasing(false);
    }
  };

  const handleSignTransaction = async () => {
    try {
      setStep('signing');
      
      toast.info('Please approve the transaction in your wallet', { id: 'signing' });
      
      // Sign and send transaction through wallet
      const signature = await signAndSendTransaction(txData);
      
      toast.dismiss('signing');
      setStep('confirming');
      toast.loading('Confirming purchase on blockchain...', { id: 'confirm' });

      // Confirm purchase on backend
      await photopayAPI.confirmPurchase({
        listing_id: id,
        buyer_wallet: walletAddress,
        transaction_signature: signature,
      });

      toast.success('Purchase confirmed!', { id: 'confirm' });
      
      setStep('success');
      
      // Navigate to success page
      setTimeout(() => {
        navigate('/success', { 
          state: { 
            listing, 
            signature 
          } 
        });
      }, 1500);

    } catch (error) {
      console.error('Transaction failed:', error);
      toast.dismiss('signing');
      toast.dismiss('confirm');
      
      // Show user-friendly error message
      let errorMessage = 'Transaction failed';
      
      if (error.message.includes('rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (error.message.includes('insufficient')) {
        errorMessage = 'Insufficient SOL balance';
      } else if (error.message.includes('expired') || error.message.includes('blockhash')) {
        errorMessage = 'Transaction expired. Please try again';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Transaction is taking longer than expected. Check Solana Explorer';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        description: 'Please try again or check your wallet',
      });
      
      setStep('initiated'); // Go back to allow retry
    }
  };

  const handleCancel = () => {
    setStep('idle');
    setTxData(null);
    setPurchasing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader size="lg" text="Loading listing..." />
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Explore
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-2xl overflow-hidden"
          >
            <img
              src={listing.file_url || listing.preview_url}
              alt={listing.title}
              className="w-full h-auto"
            />
          </motion.div>

          {/* Details & Purchase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-display font-bold mb-4">
                {listing.title}
              </h1>
              {listing.description && (
                <p className="text-muted-foreground text-lg">
                  {listing.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <Coins className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-3xl font-bold">{listing.price_sol} SOL</p>
                </div>
              </div>
            </div>

            {/* Creator Info */}
            <div className="glass-effect rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Creator</p>
                  <p className="font-mono text-sm">{truncateAddress(listing.creator_wallet)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Listed</p>
                  <p className="text-sm">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Purchase Flow */}
            <AnimatePresence mode="wait">
              {step === 'idle' && (
                <PurchaseInitialState
                  isConnected={isConnected}
                  onPurchase={handlePurchase}
                />
              )}

              {step === 'initiating' && (
                <PurchaseLoadingState message="Preparing transaction..." />
              )}

              {step === 'initiated' && txData && (
                <PurchaseReadyState
                  txData={txData}
                  onSign={handleSignTransaction}
                  onCancel={handleCancel}
                />
              )}

              {step === 'signing' && (
                <PurchaseLoadingState message="Waiting for wallet approval..." />
              )}

              {step === 'confirming' && (
                <PurchaseLoadingState message="Confirming on blockchain..." />
              )}

              {step === 'success' && (
                <PurchaseSuccessState />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for different purchase states

const PurchaseInitialState = ({ isConnected, onPurchase }) => (
  <motion.div
    key="initial"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="glass-effect rounded-2xl p-6 space-y-4"
  >
    <h3 className="font-semibold text-lg">Purchase this artwork</h3>
    
    {!isConnected && (
      <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-yellow-500 mb-1">Wallet not connected</p>
          <p className="text-muted-foreground">
            Please connect your Phantom wallet to continue
          </p>
        </div>
      </div>
    )}

    <Button
      onClick={onPurchase}
      disabled={!isConnected}
      className="w-full"
      size="lg"
    >
      <ShoppingCart className="w-5 h-5" />
      Buy Now
    </Button>
  </motion.div>
);

const PurchaseLoadingState = ({ message }) => (
  <motion.div
    key="loading"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="glass-effect rounded-2xl p-8"
  >
    <div className="flex flex-col items-center gap-4 text-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  </motion.div>
);

const PurchaseReadyState = ({ txData, onSign, onCancel }) => (
  <motion.div
    key="ready"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="glass-effect rounded-2xl p-6 space-y-4"
  >
    <h3 className="font-semibold text-lg flex items-center gap-2">
      <Check className="w-5 h-5 text-green-500" />
      Transaction Ready
    </h3>

    <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Amount:</span>
        <span className="font-semibold text-lg">{txData.amount_sol} SOL</span>
      </div>
      <div className="pt-2 border-t border-white/10">
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">From:</span>
          <span className="font-mono text-xs">{txData.from_pubkey.slice(0, 8)}...{txData.from_pubkey.slice(-8)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">To:</span>
          <span className="font-mono text-xs">{txData.to_pubkey.slice(0, 8)}...{txData.to_pubkey.slice(-8)}</span>
        </div>
      </div>
    </div>

    <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
      <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium mb-1">Ready to Purchase</p>
        <p className="text-muted-foreground">
          Make sure you have at least <span className="font-semibold">{txData.amount_sol} SOL</span> in your wallet. 
          Click "Sign Transaction" and approve it in Phantom.
        </p>
      </div>
    </div>

    <div className="flex gap-3">
      <Button
        onClick={onCancel}
        variant="secondary"
        className="flex-1"
      >
        Cancel
      </Button>
      <Button
        onClick={onSign}
        className="flex-1"
        size="lg"
      >
        <Check className="w-5 h-5" />
        Sign Transaction
      </Button>
    </div>
  </motion.div>
);

const PurchaseSuccessState = () => (
  <motion.div
    key="success"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="glass-effect glow-box rounded-2xl p-8"
  >
    <div className="text-center space-y-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600"
      >
        <Check className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="text-xl font-bold">Purchase Successful!</h3>
      <p className="text-muted-foreground">Redirecting to confirmation...</p>
    </div>
  </motion.div>
);