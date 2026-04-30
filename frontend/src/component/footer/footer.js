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
                            <span>
                                <FaPhoneAlt size={20} color="green" />
                            </span>
                            <span>07398653511</span>
                        </div>
                        <div className='d-flex flex-row row-1'>
                            <span>
                                <FaMapMarkerAlt size={20} color="red" />
                            </span>
                            <p>35 Golders Green Liverpool L7 6HG</p>
                        </div>
                        <div className='d-flex icon-wrapper mt-2'>
                            <span>
                                <FaCcVisa color="#1a1f71" />
                            </span>
                            <span>
                                <FaCcMastercard color="#ff5f00" />
                            </span>
                            <span>
                                <FaCcAmex color="#2e77bc" />
                            </span>
                            <span>
                                <FaCcDiscover color="#ff6000" />
                            </span>
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
