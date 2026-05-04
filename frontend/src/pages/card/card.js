import './card.css';
import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../component/spinner';

// Stripe element style matching the dark theme
const stripeStyle = {
    style: {
        base: {
            fontSize: '15px',
            color: '#f0f0ea',
            fontFamily: "'DM Sans', sans-serif",
            '::placeholder': { color: 'rgba(240, 240, 234, 0.25)' },
        },
        invalid: { color: '#E24B4A' },
    },
};

const Card = () => {
    const [loading, setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [paymentMethodType, setPaymentMethodType] = useState('card');
    const [alertMessage, setAlertMessage] = useState("");
    const location = useLocation();
    const total = location.state?.total || 0;
    const form = location.state?.form || {};
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);
    const cart = location.state?.cart || [];

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (loading) return;
        setLoading(true);
        setError(null);
        setAlertMessage("");

        if (!stripe || !elements) { setLoading(false); return; }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total, paymentMethodType }),
            });

            if (!response.ok) throw new Error(`Failed to create payment intent: ${response.statusText}`);

            const { clientSecret } = await response.json();
            if (!clientSecret) throw new Error('Client secret is missing in the response.');

            let confirmResult;

            if (paymentMethodType === 'card') {
                const cardNumberElement = elements.getElement(CardNumberElement);
                const cardExpiryElement = elements.getElement(CardExpiryElement);
                const cardCvcElement = elements.getElement(CardCvcElement);

                if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
                    setError('Card elements are not available.');
                    setLoading(false);
                    return;
                }

                confirmResult = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: { card: cardNumberElement },
                });
            } else if (['apple_pay', 'google_pay', 'klarna'].includes(paymentMethodType)) {
                setError(`Payment method '${paymentMethodType}' is not yet supported.`);
                setLoading(false);
                return;
            }

            if (confirmResult?.error) {
                setError(confirmResult.error.message);
            } else if (confirmResult?.paymentIntent) {
                await sendUserDataToServer(form, confirmResult.paymentIntent.id, cart);
                navigate('/order', {
                    state: {
                        order: {
                            id: confirmResult.paymentIntent.id,
                            total,
                            email: form.email,
                            items: cart.map(item => ({
                                name: item.productName,
                                quantity: item.quantity,
                            })),
                        },
                    },
                });
            } else {
                setError('An unexpected error occurred during payment confirmation.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const sendUserDataToServer = async (userData, paymentIntentId, cart) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/record-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userData, paymentIntentId, cart }),
            });

            if (!response.ok) throw new Error(`Failed to record payment: ${response.statusText}`);
            setAlertMessage("Payment recorded successfully!");
        } catch (error) {
            console.error('Error recording payment:', error);
            setError('Failed to record payment on server.');
        }
    };

    useEffect(() => {
        if (alertMessage || error) {
            const timer = setTimeout(() => {
                setFadeOut(true);
                const removeTimer = setTimeout(() => {
                    setAlertMessage("");
                    setError("");
                    setFadeOut(false);
                }, 500);
                return () => clearTimeout(removeTimer);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage, error]);

    return (
        <div className="card-section">
            <div className="card-wrapper">
                {/* Header */}
                <div className="card-text">
                    <p>£{total}</p>
                    <p>Secure Payment</p>
                </div>

                {loading && <Spinner />}

                <form className="mt-2" onSubmit={handleSubmit}>
                    {/* Payment Method */}
                    <label className="label">Payment Method</label>
                    <div className="payment-div">
                        <div>
                            <input
                                type="radio"
                                onChange={(e) => setPaymentMethodType(e.target.value)}
                                name="paymentMethod"
                                value="card"
                                defaultChecked
                            />
                            <img src="card.webp" alt="card" />
                            Card
                        </div>
                        <div>
                            <input
                                type="radio"
                                onChange={(e) => setPaymentMethodType(e.target.value)}
                                name="paymentMethod"
                                value="apple_pay"
                            />
                            <img src="apple.webp" alt="apple" />
                            Apple Pay
                        </div>
                        <div>
                            <input
                                type="radio"
                                onChange={(e) => setPaymentMethodType(e.target.value)}
                                name="paymentMethod"
                                value="google_pay"
                            />
                            <img src="google.webp" alt="google" />
                            Google Pay
                        </div>
                        <div>
                            <input
                                type="radio"
                                onChange={(e) => setPaymentMethodType(e.target.value)}
                                name="paymentMethod"
                                value="klarna"
                            />
                            <img src="klarna.webp" alt="klarna" />
                            Klarna
                        </div>
                    </div>

                    {/* Card Fields */}
                    {paymentMethodType === 'card' && (
                        <>
                            <label htmlFor="card-number">Card Number</label>
                            <CardNumberElement id="card-number" className="card-element full-width" options={stripeStyle} />

                            <label htmlFor="card-expiry">Expiry Date</label>
                            <CardExpiryElement id="card-expiry" className="card-element" options={stripeStyle} />

                            <label htmlFor="card-cvc">CVV</label>
                            <CardCvcElement id="card-cvc" className="card-element" options={stripeStyle} />
                        </>
                    )}

                    <button className="button" type="submit" disabled={!stripe || loading}>
                        {loading ? 'Processing...' : `Pay £${total}`}
                    </button>
                </form>
            </div>

            {/* Success Overlay */}
            {alertMessage && (
                <div className={`success-popup ${fadeOut ? 'success-popup-exit' : ''}`}>
                    <FontAwesomeIcon icon={faCheckCircle} color="#1D9E75" size="2x" />
                    <p>Payment Successful</p>
                    <p>{alertMessage}</p>
                </div>
            )}

            {/* Error Overlay */}
            {error && (
                <div className={`error ${fadeOut ? 'error-exit' : ''}`}>
                    <FontAwesomeIcon icon={faExclamationCircle} color="#E24B4A" size="2x" />
                    <p>Payment Declined</p>
                    <p>{error}</p>
                    <button onClick={() => setError('')}>Try Again</button>
                </div>
            )}
        </div>
    );
};

export default Card;