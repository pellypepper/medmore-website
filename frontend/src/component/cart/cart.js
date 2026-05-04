import React, { useState, useEffect } from "react";
import { FaTimes, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CartItem from "./cartitem";
import "./cart.css";

export default function Cart({ removeFromCart, cartRef }) {
    const loadCart = () => JSON.parse(sessionStorage.getItem("cart")) || [];
    const [cart, setCart] = useState(loadCart());
    const [alertMessage, setAlertMessage] = useState("");
    const [fadeOut, setFadeOut] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [shippingMethod, setShippingMethod] = useState("standard");
    const navigate = useNavigate();

    const shippingCost = shippingMethod === "express" ? 20 : shippingMethod === "standard" ? 10 : 0;

    const subtotal = cart.reduce(
        (total, product) => total + product.price * product.quantity, 0
    );

    const updateCart = (newCart) => {
        setCart(newCart);
        sessionStorage.setItem("cart", JSON.stringify(newCart));
    };

    const handleCartClose = () => {
        if (cartRef?.current) {
            cartRef.current.classList.remove("active");
        }
    };

    const handleCheckout = () => {
        navigate("/checkout", { state: { cart } });
    };

    const handleRemoveFromCart = (product) => {
        removeFromCart(product);
        updateCart(cart.filter((item) => item.productId !== product.productId));
        setAlertMessage(`${product.productName} removed from cart.`);
        setFadeOut(false);
    };

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => setFadeOut(true), 4000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    return (
        <main className="cart-main">
            {/* Header */}
            <div className="cart-header">
                <div className="cart-header-left">
                    <div className="cart-icon-wrap">
                        <FaShoppingCart size={16} color="var(--primary-color)" />
                    </div>
                    <div>
                        <div className="cart-title">Your Cart</div>
                        <div className="cart-subtitle">
                            {cart.length === 0
                                ? "No items yet"
                                : `${cart.reduce((n, i) => n + i.quantity, 0)} item${cart.reduce((n, i) => n + i.quantity, 0) !== 1 ? "s" : ""}`}
                        </div>
                    </div>
                </div>
                <button className="cart-close-btn" onClick={handleCartClose} aria-label="Close cart">
                    <FaTimes size={14} />
                </button>
            </div>

            {/* Item List */}
            <div className="cart-list">
                {cart.length === 0 ? (
                    <div className="cart-empty">
                        <FaShoppingCart size={36} opacity={0.25} />
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    cart.map((product, index) => (
                        <CartItem
                            key={index}
                            product={product}
                            index={index}
                            onIncrease={() =>
                                updateCart(cart.map((item, i) =>
                                    i === index
                                        ? { ...item, quantity: item.quantity + 1 }
                                        : item
                                ))
                            }
                            onDecrease={() =>
                                updateCart(cart.map((item, i) =>
                                    i === index && item.quantity > 1
                                        ? { ...item, quantity: item.quantity - 1 }
                                        : item
                                ))
                            }
                            onRemove={handleRemoveFromCart}
                        />
                    ))
                )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
                <div className="cart-footer">
                    {/* Promo Code */}
                    <div className="cart-promo-row">
                        <input
                            className="cart-promo-input"
                            placeholder="Promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button className="cart-promo-btn">Apply</button>
                    </div>

                    {/* Shipping */}
                    <div className="cart-field-label">Shipping method</div>
                    <select
                        className="shipping-select"
                        name="shippingMethod"
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                    >
                        <option value="standard">Standard Delivery — £10</option>
                        <option value="express">Express Delivery — £20</option>
                        <option value="cash-on-delivery">Cash on Delivery — Free</option>
                    </select>

                    {/* Breakdown */}
                    <div className="cart-breakdown">
                        <div className="cart-cost-row">
                            <span className="cart-cost-label">Subtotal</span>
                            <span className="cart-cost-val">£{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="cart-cost-row">
                            <span className="cart-cost-label">Shipping</span>
                            <span className="cart-cost-val">
                                {shippingCost === 0 ? "Free" : `£${shippingCost.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="cart-cost-divider" />
                        <div className="cart-total">
                            <h4>Total</h4>
                            <span className="total-amount">
                                £{(subtotal + shippingCost).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button className="cart-checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout →
                    </button>
                </div>
            )}

            {/* Alert Toast */}
            {alertMessage && (
                <div className={`alert-popup ${fadeOut ? "alert-popup-exit" : ""}`}>
                    {alertMessage}
                </div>
            )}
        </main>
    );
}