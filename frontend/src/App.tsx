import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import CustomRequest from './pages/CustomRequest';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AddressPage from './pages/Address';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import BookCheckup from './pages/BookCheckup';
import Referral from './pages/Referral';
import Account from './pages/Account';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Catalogue />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/custom" element={<CustomRequest />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkup" element={<BookCheckup />} />
          <Route path="/referral" element={<Referral />} />
          <Route
            path="/address"
            element={<ProtectedRoute><AddressPage /></ProtectedRoute>}
          />
          <Route
            path="/checkout"
            element={<ProtectedRoute><Checkout /></ProtectedRoute>}
          />
          <Route
            path="/order/:id"
            element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>}
          />
          <Route
            path="/account"
            element={<ProtectedRoute><Account /></ProtectedRoute>}
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
