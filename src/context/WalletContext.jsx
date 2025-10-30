import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      // Check for Phantom wallet
      if (window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect({ onlyIfTrusted: true });
        setWalletAddress(response.publicKey.toString());
      }
    } catch (error) {
      console.log('Wallet not connected');
    }
  };

  const connectWallet = async () => {
    if (!window.solana) {
      toast.error('Please install Phantom wallet!', {
        description: 'Visit phantom.app to install',
        action: {
          label: 'Get Phantom',
          onClick: () => window.open('https://phantom.app/', '_blank'),
        },
      });
      return;
    }

    try {
      setIsConnecting(true);
      const response = await window.solana.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      toast.success('Wallet connected!', {
        description: `${address.slice(0, 4)}...${address.slice(-4)}`,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.solana) {
        await window.solana.disconnect();
      }
      setWalletAddress(null);
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const signAndSendTransaction = async (transactionData) => {
    if (!window.solana) {
      throw new Error('Wallet not connected');
    }

    try {
      const { Transaction, SystemProgram, PublicKey, Connection } = await import('@solana/web3.js');

      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(transactionData.from_pubkey);
      
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(transactionData.from_pubkey),
          toPubkey: new PublicKey(transactionData.to_pubkey),
          lamports: transactionData.lamports,
        })
      );

      const { signature } = await window.solana.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature);

      return signature;

    } catch (error) {
      throw new Error(error.message || 'Transaction failed');
    }
  };

  const value = {
    walletAddress,
    isConnecting,
    connectWallet,
    disconnectWallet,
    signAndSendTransaction,
    isConnected: !!walletAddress,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};