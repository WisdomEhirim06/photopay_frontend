import axios from 'axios';

// Base URL for the backend API
const BASE_URL = import.meta.env.VITE_API_URL || 'https://photopay-backend.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// API methods
export const photopayAPI = {
  // Listings
  getAllListings: () => api.get('/api/listings/'),
  
  getListingById: (id) => api.get(`/api/listings/${id}`),
  
  createListing: (formData) => {
    return api.post('/api/listings/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getCreatorListings: (walletAddress) => 
    api.get('/api/listings/', { params: { creator_wallet: walletAddress } }),
  
  // Users
  createUser: (userData) => api.post('/api/users/', userData),
  
  getUser: (walletAddress) => api.get(`/api/users/${walletAddress}`),
  
  // Purchases
  initiatePurchase: (purchaseData) => api.post('/api/purchase/', purchaseData),
  
  confirmPurchase: (confirmData) => api.post('/api/purchase/confirm', confirmData),
  
  getUnlockedContent: (walletAddress) => 
    api.get(`/api/purchase/unlocked/${walletAddress}`),
  
  getPurchaseHistory: (walletAddress) => 
    api.get(`/api/purchase/history/${walletAddress}`),
  
  verifyTransaction: (signature) => 
    api.get(`/api/purchase/verify/${signature}`),
  
  // Creator Dashboard
  getCreatorStats: (walletAddress) => 
    api.get(`/api/listings/creator/${walletAddress}/sales`),
};

export default api;