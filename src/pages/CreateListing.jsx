import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { photopayAPI } from '../utils/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

export const CreateListing = () => {
  const navigate = useNavigate();
  const { walletAddress, isConnected } = useWallet();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_sol: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Image size must be less than 50MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Validation
    if (!imageFile) {
      toast.error('Please upload an image');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.price_sol || parseFloat(formData.price_sol) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      setLoading(true);

      // Create FormData
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price_sol', formData.price_sol);
      data.append('creator_wallet', walletAddress);
      data.append('image_file', imageFile);

      // Submit
      const response = await photopayAPI.createListing(data);
      
      toast.success('Listing created successfully!');
      
      // Navigate to the new listing
      setTimeout(() => {
        navigate(`/listing/${response.data.id}`);
      }, 1000);

    } catch (error) {
      console.error('Failed to create listing:', error);
      const message = error.response?.data?.detail || 'Failed to create listing';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Create <span className="gradient-text">Listing</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Upload your artwork and set your price
          </p>

          {!isConnected && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-6">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-500 mb-1">Wallet not connected</p>
                <p className="text-muted-foreground">
                  Please connect your wallet to create a listing
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="glass-effect rounded-2xl p-6">
              <label className="block text-sm font-semibold mb-3">
                Artwork Image *
              </label>
              
              {!imagePreview ? (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={!isConnected}
                  />
                  <motion.div
                    whileHover={{ scale: isConnected ? 1.02 : 1 }}
                    whileTap={{ scale: isConnected ? 0.98 : 1 }}
                    className={`border-2 border-dashed border-white/20 rounded-xl p-12 text-center transition-colors ${
                      isConnected ? 'cursor-pointer hover:border-primary' : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 50MB
                    </p>
                  </motion.div>
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain bg-muted"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={removeImage}
                    className="absolute top-4 right-4 w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:bg-destructive transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="glass-effect rounded-2xl p-6">
              <label className="block text-sm font-semibold mb-3">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter artwork title"
                maxLength={200}
                disabled={!isConnected}
                className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Description */}
            <div className="glass-effect rounded-2xl p-6">
              <label className="block text-sm font-semibold mb-3">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your artwork (optional)"
                maxLength={1000}
                rows={4}
                disabled={!isConnected}
                className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Price */}
            <div className="glass-effect rounded-2xl p-6">
              <label className="block text-sm font-semibold mb-3">
                Price (SOL) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.000000001"
                  min="0"
                  value={formData.price_sol}
                  onChange={(e) => setFormData({ ...formData, price_sol: e.target.value })}
                  placeholder="0.00"
                  disabled={!isConnected}
                  className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  SOL
                </span>
              </div>
            </div>

            {/* Connected Wallet Display */}
            {isConnected && (
              <div className="glass-effect rounded-2xl p-6">
                <label className="block text-sm font-semibold mb-3">
                  Creator Wallet (Connected)
                </label>
                <div className="px-4 py-3 bg-muted/50 rounded-lg font-mono text-sm">
                  {walletAddress}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Payments will be sent directly to this address
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading || !isConnected}
            >
              {loading ? 'Creating Listing...' : 'Create Listing'}
              <Check className="w-5 h-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};