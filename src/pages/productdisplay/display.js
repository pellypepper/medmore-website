import React, { useState } from "react";
import Navbar from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import Spinner from "../../component/spinner";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import './display.css';

export default function ProductDisplay() {
    const location = useLocation();
    const product = location.state?.product || {};
    const navigate = useNavigate();

    const rating = Math.floor(Math.random() * 5) + 1;
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(i < rating ? solidStar : regularStar);
    }

    const loadCart = () => JSON.parse(localStorage.getItem("cart")) || [];
    const [cart, setCart] = useState(loadCart());
    const [loading, setLoading] = useState(false);

    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const adjustQuantity = (amount) => {
        const updatedCart = cart.map((item) =>
            item.id === product.id ? { ...item, quantity: Math.max(item.quantity + amount, 1) } : item
        );
        updateCart(updatedCart);
    };

    const handleCheckout = async () => {
        setLoading(true);
        
        const updatedCart = cart.some(item => item.id === product.id)
            ? cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
              )
            : [...cart, { ...product, quantity: 1 }];
        
        updateCart(updatedCart);

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);

        navigate("/checkout");
    };

    return (
        <main>
            <Navbar />
            <section className="product-section my-4 container">
                {loading && <Spinner />}
                <div className="product-wrapper p-4">
                    <div className="product-image">
                        <img src={product.img} alt={product.name} />
                    </div>
                    <div className="product-text mt-4 mt-md-0">
                        <h1>{product.name}</h1>
                        <span>${product.price}</span>
                        <div className="rating">
                            {stars.map((star, index) => (
                                <FontAwesomeIcon key={index} icon={star} className="star" />
                            ))}
                        </div>
                        <p>Quantity</p>
                        <div className="quantity-controls">
                            <button className="btn-1" onClick={() => adjustQuantity(-1)}>-</button>
                            <span>{cart.find(item => item.id === product.id)?.quantity || 1}</span>
                            <button className="btn-1" onClick={() => adjustQuantity(1)}>+</button>
                        </div>
                        <div className="reviews">
                            <p>Reviews</p>
                            <span>Pickup available within Liverpool</span>
                            <span>Usually ready in 24 Hours</span>
                        </div>
                        <button className="btn" onClick={handleCheckout} disabled={loading}>
                            {loading ? "Processing..." : "Proceed to Checkout"}
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
