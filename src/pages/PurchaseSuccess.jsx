import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, Home, Image } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export const PurchaseSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { listing, signature } = location.state || {};

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!listing) {
    navigate('/explore');
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect glow-box rounded-3xl p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 10,
              delay: 0.2 
            }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-display font-bold mb-4">
              Purchase Successful!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              You now own <span className="text-foreground font-semibold">{listing.title}</span>
            </p>
          </motion.div>

          {/* Purchase Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-muted/50 rounded-2xl p-6 mb-8 text-left space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-semibold text-lg">{listing.price_sol} SOL</span>
            </div>
            
            {signature && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-muted-foreground mb-2">Transaction Signature</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono bg-background rounded-lg px-3 py-2 overflow-x-auto">
                    {signature}
                  </code>
                  <a
                    href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.div>
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/explore')}
              className="flex-1"
            >
              <Image className="w-5 h-5" />
              Explore More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};