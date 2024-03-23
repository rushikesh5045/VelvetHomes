import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId");

  const addToCart = async (item) => {
    const existingProduct = cartItems.find(
      (existingItem) => existingItem.productId === item.productId
    );

    if (existingProduct) {
      const updatedCart = cartItems.map((cartItem) =>
        cartItem.productId === existingProduct.productId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );

      setCartItems((prevCart) => updatedCart);

      await updateCartInDatabase(updatedCart);
    } else {
      setCartItems((prevCart) => [...prevCart, { ...item, quantity: 1 }]);

      await updateCartInDatabase([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = async (prod) => {
    const updatedCart = cartItems
      .map((item) =>
        item.productId === prod.productId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems((prevCart) => updatedCart);

    await updateCartInDatabase(updatedCart);
  };
  const clearCart = async () => {
    setCartItems([]);

    try {
      const response = await fetch(
        "https://velvethomes-bpj4.onrender.com/input/user/clearCart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId }),
        }
      );

      if (response.ok) {
        console.log("Cart cleared successfully in the database");
      } else {
        console.error("Error clearing cart in the database");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const updateCartInDatabase = async (updatedCart) => {
    console.log(updatedCart);
    try {
      const response = await fetch(
        "https://velvethomes-bpj4.onrender.com/input/user/updateCart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId, cart: updatedCart }),
        }
      );

      if (response.ok) {
        console.log("Cart updated successfully in the database");
      } else {
        console.error("Error updating cart in the database");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  useEffect(() => {
    updateCartInDatabase(cartItems);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
