import React, { createContext, useEffect, useState } from "react";
import axiosDriver from "../config/axios";
const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // useEffect(() => {
  // }, []);

  useEffect(() => {
    fetchData();
    axiosDriver.get("http://localhost:3000/api/carts").then((response) => {
      if (response.data?.items) {
        setCartItems(response.data.items);
      }
    });
  }, []);

  const fetchData = async () => {
    const response = await axiosDriver.get(
      "http://localhost:3000/api/products"
    );
    if (response.data.error !== 1) {
      setProducts(response.data.data);
    }
  };

  const getCartIndex = (productId) => {
    const cartIndex = cartItems.findIndex((cartItem) => {
      return cartItem._id === productId;
    });
    return cartIndex;
  };

  const updateAPI = (items) => {
    axiosDriver
      .put("http://localhost:3000/api/carts", {
        items: items,
      })
      .then((response) => {
        if (response.data?.items) {
          setCartItems(response.data.items);
        }
      });
  };

  const addToCart = (productId) => {
    const index = getCartIndex(productId);
    let newCartItems = [...cartItems];

    if (index > -1) {
      newCartItems[index].qty += 1;
    } else {
      const product = products.find((product) => product._id === productId);
      newCartItems.push({ _id: productId, product: product, qty: 1 });
    }
    updateAPI(newCartItems);
    setCartItems(newCartItems);
  };

  const removeCart = (productId) => {
    const index = getCartIndex(productId);
    if (index < 0) return;

    let newCartItems = [...cartItems];
    if (cartItems[index].qty > 1) {
      newCartItems[index].qty -= 1;
    } else {
      newCartItems.splice(index, 1);
    }
    updateAPI(newCartItems);
    setCartItems(newCartItems);
  };

  const updateCartItemCount = (newAmount, itemId) => {
    const newCartItems = [...cartItems];
    const itemIndex = newCartItems.findIndex(
      (cartItem) => cartItem._id === itemId
    );

    if (itemIndex !== -1) {
      newCartItems[itemIndex].qty = newAmount;
    }

    updateAPI(newCartItems); // Update API
    setCartItems(newCartItems); // Update state
  };

  const getCartQty = (productId) => {
    const index = getCartIndex(productId);
    return index > -1 ? cartItems[index].qty : null;
  };

  const resetCart = () => {
    setCartItems([]);
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeCart,
    updateCartItemCount,
    getCartQty,
    resetCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export { ShopContextProvider, ShopContext };
