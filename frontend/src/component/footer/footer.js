import React, { useState } from 'react';
import {
    FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover,
    FaMapMarkerAlt, FaPhoneAlt
} from 'react-icons/fa';
import './footer.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!email.trim()) return;
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <footer>
            <div className="footer-wrapper">
                <div className="row p-3">

                    {/* Contact column */}
                    <div className="col-12 col-md-6">
                        <p className="footer-col-label">Contact Us</p>

                        <div className="row-1">
                            <span className="contact-icon">
                                <FaPhoneAlt size={14} color="rgba(255,255,255,0.7)" />
                            </span>
                            <span>07398653511</span>
                        </div>

                        <div className="row-1">
                            <span className="contact-icon">
                                <FaMapMarkerAlt size={14} color="rgba(255,255,255,0.7)" />
                            </span>
                            <p>35 Golders Green Liverpool L7 6HG</p>
                        </div>

                        <div className="icon-wrapper mt-2">
                            <span title="Visa"><FaCcVisa color="#1a1f71" /></span>
                            <span title="Mastercard"><FaCcMastercard color="#ff5f00" /></span>
                            <span title="Amex"><FaCcAmex color="#2e77bc" /></span>
                            <span title="Discover"><FaCcDiscover color="#ff6000" /></span>
                        </div>
                    </div>

                    {/* Newsletter column */}
                    <div className="col-12 col-md-6 footer-2">
                        <p className="footer-col-label">Stay in the loop</p>
                        <p className="footer-tagline">
                            Sign up for discounts and updates — no spam, ever.
                        </p>

                        <div className="email-field-wrapper">
                            <textarea
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button onClick={handleSubmit}>
                            {submitted ? '✓ You\'re in' : 'Subscribe'}
                        </button>
                    </div>

                </div>
            </div>

            <div className="footer-divider" />

            <div className="footer-bottom">
                <p>© 2024 MedMore Foods. All Rights Reserved</p>
                <div className="footer-bottom-links">
                    <a href="/privacy">Privacy</a>
                    <a href="/terms">Terms</a>
                    <a href="/contact">Contact</a>
                </div>
            </div>
        </footer>
    );
}