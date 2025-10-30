import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, Plus, Wallet, Home, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { useWallet } from '../context/WalletContext';

export const Navbar = () => {
  const location = useLocation();
  const { walletAddress, isConnecting, connectWallet, disconnectWallet, isConnected } = useWallet();
  
  const isActive = (path) => location.pathname === path;

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold gradient-text">
                PhotoPay
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" isActive={isActive('/')}>
              <Home className="w-4 h-4" />
              Home
            </NavLink>
            <NavLink to="/explore" isActive={isActive('/explore')}>
              <Image className="w-4 h-4" />
              Explore
            </NavLink>
            <NavLink to="/create" isActive={isActive('/create')}>
              <Plus className="w-4 h-4" />
              Create
            </NavLink>
          </div>

          {/* Wallet Button */}
          {!isConnected ? (
            <Button 
              variant="primary" 
              size="sm"
              onClick={connectWallet}
              loading={isConnecting}
              disabled={isConnecting}
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 glass-effect px-4 py-2 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-mono">{truncateAddress(walletAddress)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={disconnectWallet}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, children, isActive }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ y: -2 }}
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </motion.div>
  </Link>
);