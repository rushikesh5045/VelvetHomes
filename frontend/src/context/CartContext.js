import React, { createContext, useContext, useState,useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId");

  const addToCart = async (item) => {
    const existingProduct = cartItems.find(
      (existingItem) => existingItem.productId === item.productId
    );

    if (existingProduct) {
      // Product already exists in the cart, update its quantity
      const updatedCart = cartItems.map((cartItem) =>
        cartItem.productId === existingProduct.productId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );

      // Update local state using the callback form to ensure the latest state
      setCartItems((prevCart) => updatedCart);

      // Make a request to update the user's cart in the database
      await updateCartInDatabase(updatedCart);
    } else {
      // Product doesn't exist in the cart, add it with quantity 1
      setCartItems((prevCart) => [...prevCart, { ...item, quantity: 1 }]);

      // Make a request to update the user's cart in the database
      await updateCartInDatabase([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = async (prod) => {
    // Remove item from local state
    const updatedCart = cartItems
      .map((item) =>
        item.productId === prod.productId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
      .filter((item) => item.quantity > 0);

    // Update local state using the callback form to ensure the latest state
    setCartItems((prevCart) => updatedCart);

    // Make a request to update the user's cart in the database
    await updateCartInDatabase(updatedCart);
  };
  const clearCart = async () => {
    // Clear local state
    setCartItems([]);

    // Clear cart in the database
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
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
