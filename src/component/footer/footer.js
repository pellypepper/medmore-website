import React from 'react';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import './footer.css';

export default function Footer() {
    return (
        <footer>
            <div className="footer-wrapper">
                <div className="row p-3">
                    <div className='col-12 col-md-6'>
                        <p>CONTACT US</p>
                        <div className='d-flex flex-row row-1 mt-4'>
                            <span aria-label="Phone"><FaPhoneAlt size={20} color="green" /></span>
                            <span>07398653511</span>
                        </div>
                        <div className='d-flex flex-row row-1'>
                            <span aria-label="Location"><FaMapMarkerAlt size={20} color="red" /></span>
                            <p>35 Golders Green Liverpool L7 6HG</p>
                        </div>
                        <div className='d-flex icon-wrapper mt-2'>
                            <span aria-label="Visa"><FaCcVisa size={50} color="#1a1f71" /></span>
                            <span aria-label="MasterCard"><FaCcMastercard size={50} color="#ff5f00" /></span>
                            <span aria-label="American Express"><FaCcAmex size={50} color="#2e77bc" /></span>
                            <span aria-label="Discover"><FaCcDiscover size={50} color="#ff6000" /></span>
                        </div>
                    </div>

                    <div className='col-12 col-md-6 footer-2'>
                        <p>SIGN UP FOR DISCOUNT AND UPDATES</p>
                        <textarea placeholder="Enter your email"></textarea>
                        <button>Submit</button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2024 MedMore Foods. All Rights Reserved</p>
            </div>
        </footer>
    );
}
