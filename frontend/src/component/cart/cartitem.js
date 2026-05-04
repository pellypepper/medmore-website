import React from "react";
import "./cart.css";

export default function CartItem({ product, index, onIncrease, onDecrease, onRemove }) {

  
    return (
        <div className="cart-item">
            {/* Thumbnail placeholder — swap for <img> if you have product images */}
            <div className="cart-item-thumb">
                {product.productImg

                    ? <img src={product.productImg
} alt={product.productName} width="100%" height="100%" style={{ objectFit: "cover", borderRadius: 9 }} />
                    : <span style={{ fontSize: 22 }}>🛍️</span>
                }
            </div>

            <div className="cart-item-details">
                <p>{product.productName}</p>
                <p className="item-price">£{(product.price * product.quantity).toFixed(2)}</p>
            </div>

            <div className="cart-item-controls">
                <div className="quantity-controls">
                    <button onClick={() => onDecrease(index)} aria-label="Decrease">−</button>
                    <span>{product.quantity}</span>
                    <button onClick={() => onIncrease(index)} aria-label="Increase">+</button>
                </div>
                <button className="btn-2" onClick={() => onRemove(product)}>
                    Remove
                </button>
            </div>
        </div>
    );
}