import React, { useState } from 'react';
import Navbar from '../../component/navbar/navbar';
import Footer from '../../component/footer/footer';
import Spinner from '../../component/spinner'; 
import './payment.css'; 
import { useNavigate, useLocation } from "react-router-dom";

export default function Payment() {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();
    const location = useLocation();
    const cart = location.state?.cart || [];
    const total = location.state?.total || 0;
    const form = location.state?.form || {};

    const handleGoBack = () => {
        navigate('/checkout');
    };

    const handleClick = (e) => {
        e.preventDefault();
        setLoading(true); 

   
        setTimeout(() => {

            if (paymentMethod === 'bank-transfer') {
                navigate('/detail', { state: { total, form, cart } }); 
            } else {
                navigate('/card', { state: { total, form, cart } });
            }
            setLoading(false); 
        }, 1000);
    };

    return (
        <main className="payment-main">
            <section>
            <Navbar />
            </section>
            <section className="payment-section">
                <h2 className="payment-title">Choose Payment Method</h2>
                {loading && <Spinner />} 
                <form className="payment-options" onSubmit={handleClick}>
                    <div className="payment-option">
                        <input 
                            type="radio" 
                            id="pay-online" 
                            name="payment" 
                            value="pay-online" 
                            checked={paymentMethod === 'pay-online'}
                            onChange={() => setPaymentMethod('pay-online')} 
                            required
                        />
                        <label htmlFor="pay-online">Pay Online</label>
                    </div>
                    <div className="payment-option">
                        <input 
                            type="radio" 
                            id="bank-transfer" 
                            name="payment" 
                            value="bank-transfer" 
                            checked={paymentMethod === 'bank-transfer'}
                            onChange={() => setPaymentMethod('bank-transfer')} 
                            required
                        />
                        <label htmlFor="bank-transfer">Pay Via Bank Transfer</label>
                    </div>
                    <div className='payment-btn d-flex justify-content-center'>
                        <button type="button" onClick={handleGoBack} className="payment-button">Go Back</button>
                        <button type="submit" className="payment-button" disabled={!paymentMethod || loading}>
                            {loading ? "Processing..." : "Proceed to Pay"}
                        </button>
                    </div>
                </form>
            </section>
    <section>
    <Footer />
    </section>
        </main>
    );
}
