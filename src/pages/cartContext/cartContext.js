import React, { createContext, useState, useCallback, useEffect } from "react";

// Create the CartContext
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = sessionStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Update sessionStorage whenever the cart changes
    const updateSessionStorageCart = useCallback((updatedCart) => {
        sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    }, []);

    // Add to cart
    const addToCart = async (product, quantity) => {
        const userId = getUserId();
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        let updatedCart;

        if (existingProductIndex > -1) {
            updatedCart = cart.map((item, index) =>
                index === existingProductIndex
                    ? { ...item, quantity: item.quantity + parseInt(quantity) }
                    : item
            );
        } else {
            updatedCart = [...cart, { ...product, quantity: parseInt(quantity) }];
        }

        // Update state and session storage
        setCart(updatedCart);
        updateSessionStorageCart(updatedCart);

        try {
            await fetch("http://localhost:4000/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    product: {
                        id: product.id,
                        name: product.name,
                        price: parseInt(product.price),
                        img: product.img,
                    },
                    quantity: parseInt(quantity),
                }),
            });
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    // Remove from cart
    const removeFromCart = async (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
        updateSessionStorageCart(updatedCart);

        try {
            await fetch("http://localhost:4000/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: getUserId(), productId }),
            });
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    // Get User ID
    const getUserId = useCallback(() => {
        let userId = sessionStorage.getItem("user_id");
        if (!userId) {
            userId = "user_" + Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem("user_id", userId);
        }
        return userId;
    }, []);

    // Effect to update session storage whenever cart changes
    useEffect(() => {
        updateSessionStorageCart(cart);
    }, [cart, updateSessionStorageCart]); // Updated dependency array

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
