import './card.css';
import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../component/spinner';

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
        if (loading) return; // Prevent double clicks
        setLoading(true);
        setError(null);
        setAlertMessage("");

        if (!stripe || !elements) {
      
            setLoading(false);
            return;
        }

        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total, paymentMethodType }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create payment intent: ${response.statusText}`);
            }

            const { clientSecret } = await response.json();
            console.log(clientSecret);
            if (!clientSecret) {
                throw new Error('Client secret is missing in the response.');
            }



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
                    payment_method: {
                        card: cardNumberElement,
                    },
                });
            } else if (['apple_pay', 'google_pay', 'klarna'].includes(paymentMethodType)) {
              setError(`Payment method '${paymentMethodType}' is not yet supported.`);
                setLoading(false);
                return;
            }

            if (confirmResult && confirmResult.error) {

                setError(confirmResult.error.message);
            } else if (confirmResult && confirmResult.paymentIntent) {
             
                await sendUserDataToServer(form, confirmResult.paymentIntent.id, cart);
                navigate('/order', {
                    state: {
                        order: {
                            id: confirmResult.paymentIntent.id,
                            total: total,
                            email: form.email,
                            items: cart.map(item => ({
                                name: item.productName, // Ensure the property is correct
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
            setLoading(false); // Ensure loading state is turned off
        }
    };

    const sendUserDataToServer = async (userData, paymentIntentId, cart) => {
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/payment/record-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userData, paymentIntentId, cart }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to record payment: ${response.statusText}`);
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error('Payment was not recorded successfully.');
            }
            setAlertMessage(` "Payment recorded successfully!" `);
        } catch (error) {
            console.error('Error recording payment:', error);
            setError('Failed to record payment on server.');
        }
    };
    

    useEffect(() => {
        if (alertMessage || error) {
            const timer = setTimeout(() => {
                setFadeOut(true); 
                const removeAlertTimer = setTimeout(() => {
                    setAlertMessage(""); 
                    setError("");
                    setFadeOut(false); 
                }, 500); 

                return () => clearTimeout(removeAlertTimer);
            }, 5000); 

            return () => clearTimeout(timer); 
        }
    }, [alertMessage, error]);

  
    

    return (
        <div className='card-section'>
            <div className='card-wrapper'>
                <div className='card-text'>
                    <p>${total}</p>
                    <p>Payment</p>
                </div>

                {loading && <Spinner />} 
                
                <form className='mt-2' onSubmit={handleSubmit}>
                    <label className='label'>
                        Payment Method:
                        <div className='payment-div'>
                            <div>
                                <input
                                    type='radio'
                                    onChange={(e) => setPaymentMethodType(e.target.value)}
                                    name='paymentMethod'
                                    value='card'
                                    defaultChecked
                                />
                                <img src='card.webp' alt='card' /> Card
                            </div>
                            <div>
                                <input
                                    type='radio'
                                    onChange={(e) => setPaymentMethodType(e.target.value)}
                                    name='paymentMethod'
                                    value='apple_pay'
                                />
                                <img src='apple.webp' alt='apple' /> Apple Pay
                            </div>
                            <div>
                                <input
                                    type='radio'
                                    onChange={(e) => setPaymentMethodType(e.target.value)}
                                    name='paymentMethod'
                                    value='google_pay'
                                />
                                <img src='google.webp' alt='google' /> Google Pay
                            </div>
                            <div>
                                <input
                                    type='radio'
                                    onChange={(e) => setPaymentMethodType(e.target.value)}
                                    name='paymentMethod'
                                    value='klarna'
                                />
                                <img src='klarna.webp' alt='klarna' /> Klarna
                            </div>
                        </div>
                    </label>

                    {paymentMethodType === 'card' && (
                        <>
                            <label htmlFor="card-number">Card Number</label>
                            <CardNumberElement
                                id="card-number"
                                className="card-element full-width"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }}
                            />

                            <label htmlFor="card-expiry">Expiry Date</label>
                            <CardExpiryElement
                                id="card-expiry"
                                className="card-element"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }}
                            />

                            <label htmlFor="card-cvc">CVV</label>
                            <CardCvcElement
                                id="card-cvc"
                                className="card-element"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }}
                            />
                        </>
                    )}
                    <button className='button' type="submit" disabled={!stripe || loading}>
                        {loading ? 'Processing...' : `Pay Now $${total}`}
                    </button>
                    {error && <div className='error'>{error}</div>}
                </form>
            </div>

            {alertMessage && (
                <div className={`success-popup ${fadeOut ? 'success-popup-exit' : ''}`}>
                    <FontAwesomeIcon icon={faCheckCircle} color="green" size="2x" />
                    <p>Payment Successful</p>
                    <p>{alertMessage}</p>
                </div>
            )}

            {error && (
                <div className={`error ${fadeOut ? 'error-exit' : ''}`}>
                    <FontAwesomeIcon icon={faExclamationCircle} color="red" size="2x" />
                    <p>Payment Declined</p>
                    <p>{error}</p>
                    <button className='mt-1' onClick={() => setError('')}> Try Again</button>
                </div>
            )}
        </div>
    );
};

export default Card;
