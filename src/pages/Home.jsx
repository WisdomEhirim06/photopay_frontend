import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Coins, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useEffect, useState } from 'react';
import { photopayAPI } from '../utils/api';

export const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ listings: 0, creators: 0, sales: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await photopayAPI.getAllListings();
      setStats({
        listings: data.length,
        creators: new Set(data.map(l => l.creator_wallet)).size,
        sales: Math.floor(Math.random() * 100), // Placeholder
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <span className="glass-effect px-4 py-2 rounded-full text-sm font-medium">
                ⚡ Powered by Solana
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Own Digital Art
              <br />
              <span className="gradient-text">Instantly</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Buy and sell unique photography with lightning-fast Solana payments. 
              No middlemen. Just creators and collectors.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/explore')}
              >
                Explore Listings
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/create')}
              >
                Create Listing
              </Button>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 left-10 w-20 h-20 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-60 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-3xl"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            value={stats.listings}
            label="Active Listings"
          />
          <StatCard
            icon={<Shield className="w-8 h-8" />}
            value={stats.creators}
            label="Verified Creators"
          />
          <StatCard
            icon={<Coins className="w-8 h-8" />}
            value={`${stats.sales}+`}
            label="Total Sales"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Why <span className="gradient-text">PhotoPay</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              The future of digital art commerce is here
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Lightning Fast"
              description="Instant transactions powered by Solana. No waiting, no delays."
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10" />}
              title="Secure & Transparent"
              description="Every transaction is verifiable on the blockchain. Full transparency."
            />
            <FeatureCard
              icon={<Coins className="w-10 h-10" />}
              title="Low Fees"
              description="Minimal platform fees. More money goes directly to creators."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-effect glow-box rounded-3xl p-12 text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Start?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of creators and collectors on PhotoPay
          </p>
          <Button size="lg" onClick={() => navigate('/explore')}>
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="glass-effect rounded-2xl p-8 text-center"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
      {icon}
    </div>
    <div className="text-3xl font-bold mb-2 gradient-text">{value}</div>
    <div className="text-muted-foreground">{label}</div>
  </motion.div>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="glass-effect rounded-2xl p-8"
  >
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);