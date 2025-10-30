import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Package, Clock } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { photopayAPI } from '../utils/api';
import { Loader } from '../components/Loader';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { walletAddress, isConnected } = useWallet();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('creator'); // creator or buyer

  useEffect(() => {
    if (isConnected) {
      loadData();
    }
  }, [isConnected, walletAddress]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [creatorData, purchaseData] = await Promise.all([
        photopayAPI.getCreatorStats(walletAddress),
        photopayAPI.getPurchaseHistory(walletAddress)
      ]);
      setStats(creatorData.data);
      setPurchases(purchaseData.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to view dashboard</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display font-bold mb-8">
          <span className="gradient-text">Dashboard</span>
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'creator' ? 'bg-primary text-white' : 'glass-effect'
            }`}
          >
            Creator Stats
          </button>
          <button
            onClick={() => setActiveTab('buyer')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'buyer' ? 'bg-primary text-white' : 'glass-effect'
            }`}
          >
            Purchase History
          </button>
        </div>

        {activeTab === 'creator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={<DollarSign />} label="Total Earnings" value={`${stats?.total_earnings_sol || 0} SOL`} />
              <StatCard icon={<TrendingUp />} label="Total Sales" value={stats?.total_sales || 0} />
              <StatCard icon={<Package />} label="Active Listings" value={stats?.active_listings || 0} />
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Sales</h3>
              {stats?.recent_sales?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recent_sales.map((sale) => (
                    <div key={sale.id} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{sale.listing.title}</p>
                        <p className="text-sm text-muted-foreground">{new Date(sale.purchased_at).toLocaleDateString()}</p>
                      </div>
                      <p className="font-bold text-green-500">{sale.amount_sol} SOL</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No sales yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'buyer' && (
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Your Purchases</h3>
            {purchases.length > 0 ? (
              <div className="space-y-3">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Purchase #{purchase.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(purchase.purchased_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{purchase.amount_sol} SOL</p>
                      <p className={`text-sm ${purchase.status === 'confirmed' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {purchase.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No purchases yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass-effect rounded-2xl p-6"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="text-primary">{icon}</div>
      <p className="text-muted-foreground">{label}</p>
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);