import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Lazy load components
const Home = lazy(() => import('./pages/home/home'));
const Payment = lazy(() => import('./pages/payment/payment'));
const Detail = lazy(() => import('./pages/details/detail'));
const Card = lazy(() => import('./pages/card/card'));
const ProductDisplay = lazy(() => import('./pages/productdisplay/display'));
const Checkout = lazy(() => import('./pages/checkout/checkout'));
const AdminDashboard = lazy(() => import('./pages/adminDashboard/admin'));
const OrderConfirmation = lazy(() => import('./pages/order/order'));

// Stripe configuration with error handling
const getStripe = () => {
  const stripeKey = process.env.STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    console.error('Stripe API key is missing. Please check your .env file.');
    return null;
  }
 

  try {
    return loadStripe(stripeKey);
  } catch (error) {
    console.error('Error loading Stripe:', error);
    return null;
  }
};

const stripePromise = getStripe();

// Error boundary for Stripe integration
class StripeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Stripe Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Error loading payment system. Please try again later.</div>;
    }

    return this.props.children;
  }
}

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = sessionStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const updateSessionStorageCart = (newCart) => {
    if (newCart.length > 0) {
      sessionStorage.setItem("cart", JSON.stringify(newCart));
    } else {
      sessionStorage.removeItem("cart");
    }
  };

  const removeFromCart = async (product) => {
    try {
      const newCart = cart.filter(item => item.id !== product.productId);
      setCart(newCart);
      updateSessionStorageCart(newCart);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: sessionStorage.getItem("user_id"),
          productId: product.productId
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to remove item from cart");
      }

      const serverCart = await response.json();
      setCart(serverCart);
      updateSessionStorageCart(serverCart);

    } catch (error) {
      console.error("Error removing item from server:", error);
      setCart(cart);
      updateSessionStorageCart(cart);
    }
  };

  // Only render Elements if Stripe is properly initialized
  const renderStripeElements = () => {
    if (!stripePromise) {
      return <div>Unable to load payment system. Please check your configuration.</div>;
    }

    return (
      <Elements stripe={stripePromise}>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home removeFromCart={removeFromCart} />} />
              <Route path="/checkout" element={<Checkout removeFromCart={removeFromCart} />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/card" element={<Card />} />
              <Route path="/detail" element={<Detail />} />
              <Route path="/display" element={<ProductDisplay />} />
              <Route path="/order" element={<OrderConfirmation />} />
            </Routes>
          </Suspense>
        </Router>
      </Elements>
    );
  };

  return (
    <StripeErrorBoundary>
      {renderStripeElements()}
    </StripeErrorBoundary>
  );
}

export default App;