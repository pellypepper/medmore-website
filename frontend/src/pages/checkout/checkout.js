import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../component/navbar/navbar";
import Footer from "../../component/footer/footer";
import Country from "../../component/search/country";
import ShippingMethod from "../../component/shippingmethod/shippingmethod";
import Spinner from "../../component/spinner";
import "./checkout.css";

export default function Checkout({ removeFromCart }) {
    const navigate = useNavigate();
    const loadCart = () => JSON.parse(sessionStorage.getItem("cart")) || [];
    const [cart, setCart] = useState(loadCart());
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        number: "",
        address: "",
        shippingMethod: "standard",
        country: "",
        state: "",
        postcode: "",
    });
    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const shippingFees = {
        standard: 10,
        express: 20,
        "cash-on-delivery": 0,
    };

    const updateCart = (newCart) => {
        setCart(newCart);
        sessionStorage.setItem("cart", JSON.stringify(newCart));
    };

    const calculateSubtotal = () =>
        cart.reduce((total, product) => total + product.price * product.quantity, 0);

    const calculateTotal = () => {
        const shippingCost = shippingFees[form.shippingMethod] || 0;
        return calculateSubtotal() + shippingCost;
    };

    const handleInputChange = ({ target: { name, value } }) =>
        setForm((prev) => ({ ...prev, [name]: value }));

    const handleCountrySelect = (country) =>
        setForm((prev) => ({ ...prev, country }));

    const handleStateSelect = (state) =>
        setForm((prev) => ({ ...prev, state }));

    const handleRemoveFromCart = (product) => {
        removeFromCart(product);
        updateCart(cart.filter((item) => item.productId !== product.productId));
        setAlertMessage(`${product.productName} removed from cart.`);
    };

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => setAlertMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const total = calculateTotal();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/payment", { state: { total, cart, form } });
        setLoading(false);
    };

    const shippingCost = shippingFees[form.shippingMethod] || 0;

    return (
        <main className="checkout-section">
            <Navbar />

            <section className="checkout-main">
                {loading && <Spinner />}

                <div className="checkout-container">

                    {/* ── Cart panel ── */}
                    <div className="cart-section">
                        <h2>Your Cart</h2>

                        <div className="cart-list">
                            {cart.length === 0 ? (
                                <p>Your cart is empty.</p>
                            ) : (
                                cart.map((product, index) => (
                                    <div key={index} className="cart-item">
                                        <div className="cart-item-details">
                                            <p>{product.productName}</p>
                                            <p>£{product.price.toFixed(2)} × {product.quantity}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFromCart(product)}
                                            aria-label={`Remove ${product.productName} from cart`}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {alertMessage && (
                            <div className="alert-popup">{alertMessage}</div>
                        )}

                        <div className="shipping-wrapper">
                            <h3>Shipping Method</h3>
                            <ShippingMethod
                                shippingMethod={form.shippingMethod}
                                handleChange={handleInputChange}
                            />
                        </div>

                        <div className="cart-total">
                            <h4>{cart.length} item{cart.length !== 1 ? 's' : ''}</h4>
                            <h4>Total: £{calculateTotal().toFixed(2)}</h4>
                        </div>
                    </div>

                    {/* ── Form panel ── */}
                    <div className="checkout-form-section">
                        <h2>Checkout Details</h2>

                        <form onSubmit={handleOrderSubmit}>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="firstname"
                                    value={form.firstname}
                                    onChange={handleInputChange}
                                    placeholder="First Name"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastname"
                                    value={form.lastname}
                                    onChange={handleInputChange}
                                    placeholder="Last Name"
                                    required
                                />
                            </div>

                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    placeholder="Email Address"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="number"
                                    value={form.number}
                                    onChange={handleInputChange}
                                    placeholder="Phone Number"
                                    required
                                />
                            </div>

                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleInputChange}
                                placeholder="Shipping Address"
                                required
                            />

                            <Country
                                onCountrySelect={handleCountrySelect}
                                onStateSelect={handleStateSelect}
                            />

                            <input
                                type="text"
                                name="postcode"
                                value={form.postcode}
                                onChange={handleInputChange}
                                placeholder="Zip / Postcode"
                                required
                            />

                            <button type="submit" disabled={loading}>
                                {loading ? "Processing..." : "Proceed to Payment →"}
                            </button>
                        </form>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}