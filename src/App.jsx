import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { WalletProvider } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { CreateListing } from './pages/CreateListing';
import { ListingDetail } from './pages/ListingDetail';
import { PurchaseSuccess } from './pages/PurchaseSuccess';

function App() {
  return (
    <Router>
      <WalletProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/create" element={<CreateListing />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/success" element={<PurchaseSuccess />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="bottom-right"
            theme="dark"
            richColors
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </div>
      </WalletProvider>
    </Router>
  );
}

export default App;