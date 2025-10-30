import { motion } from 'framer-motion';
import { User, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="glass-effect rounded-xl overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={listing.preview_url || listing.file_url}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price Badge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 glass-effect px-3 py-2 rounded-lg flex items-center gap-2"
        >
          <Coins className="w-4 h-4 text-secondary" />
          <span className="font-semibold text-sm">{listing.price_sol} SOL</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg mb-2 truncate">
          {listing.title}
        </h3>
        
        {listing.description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {listing.description}
          </p>
        )}

        {/* Creator Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="font-mono">{truncateAddress(listing.creator_wallet)}</span>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
          >
            <span className="text-xs font-bold">→</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};