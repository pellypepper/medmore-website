import React, { useRef, useState } from "react";
import { FaSearch, FaTimes, FaBars, FaUser, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import Cart from "../cart/cart";
import Spinner from "../spinner";

export default function Navbar({ cart, setCart, removeFromCart, setSearchQuery }) {
    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const loginRef = useRef(null);
    const cartRef = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toggleVisibility = (ref) => ref.current?.classList.toggle("active");
    const closeVisibility = (ref) => ref.current?.classList.remove("active");

    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || "Login failed");
                return;
            }
            const data = await response.json();
            if (data.user?.isAdmin) {
                navigate("/admin");
            } else {
                alert("You do not have permission to access the admin page.");
            }
        } catch (error) {
            alert("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="main">
            <div className="container-fluid">
                <div className="row h-100">
                    {/* Logo */}
                    <div className="logo-wrapper col-6">
                        <Link to="/">
                            <div className="logo">MEDMORE</div>
                        </Link>
                    </div>

                    {/* Icon Buttons */}
                    <nav className="col-6 d-flex justify-content-end">
                        <button onClick={() => toggleVisibility(searchRef)} aria-label="Search Button">
                            <FaSearch className="icon" />
                        </button>
                        <button onClick={() => toggleVisibility(loginRef)} aria-label="Profile-icon">
                            <FaUser className="icon" />
                        </button>
                        <button onClick={() => toggleVisibility(menuRef)} aria-label="Menu-icon">
                            <FaBars className="icon" />
                        </button>
                        <button onClick={() => toggleVisibility(cartRef)} aria-label="Shopping-cart">
                            <FaShoppingCart className="icon" />
                        </button>
                    </nav>
                </div>
            </div>

            {/* ── Search Bar ── */}
            <form className="form" ref={searchRef} onSubmit={(e) => e.preventDefault()}>
                <input
                    type="search"
                    placeholder="Search products…"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaTimes onClick={() => closeVisibility(searchRef)} className="times" />
            </form>

            {/* ── Side Menu ── */}
            <aside className="side-menu" ref={menuRef}>
                <div onClick={() => closeVisibility(menuRef)} className="close-div">
                    <FaTimes className="times" />
                </div>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="#">About</Link></li>
                        <li><Link to="#">Services</Link></li>
                        <li><Link to="#">Contact</Link></li>
                    </ul>
                </nav>
            </aside>

            {/* ── Login Modal ── */}
            <div className="login" ref={loginRef}>
                <div className="login-wrapper">
                    <FaTimes
                        onClick={() => closeVisibility(loginRef)}
                        className="times"
                        style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', cursor: 'pointer', color: 'rgba(30,30,30,0.35)', fontSize: 16 }}
                    />
                    <h3>LOGIN</h3>
                    <p className="border" />
                    <form onSubmit={handleLoginFormSubmit}>
                        <input
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                        />
                        <input
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                        />
                        <div className="remember-wrapper">
                            <div className="d-flex">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </div>
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? <Spinner /> : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Cart Panel ── */}
            <div ref={cartRef} className="cart">
                <Cart
                    cartRef={cartRef}
                    cart={cart}
                    removeFromCart={removeFromCart}
                    setCart={setCart}
                />
            </div>
        </main>
    );
}