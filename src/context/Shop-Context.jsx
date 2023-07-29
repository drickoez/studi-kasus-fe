// import React, { createContext, useEffect, useState } from "react";
// import { PRODUCTS } from "../products";
// import axios from "axios";

// const ShopContext = createContext(null);

// const getDefaultCart = () => {
//   let cart = {};
//   for (let i = 1; i < PRODUCTS.length + 1; i++) {
//     cart[i] = 0;
//   }
//   return cart;
// };

// const ShopContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState(getDefaultCart());
//   useEffect(() => {
//     // axios.put("http://localhost:3000/api/carts", {
//     //   items:
//     // });
//     console.log(cartItems);
//   }, [cartItems]);

//   const getTotalCartAmount = () => {
//     let totalAmount = 0;
//     for (const item in cartItems) {
//       if (cartItems[item] > 0) {
//         let itemInfo = PRODUCTS.find((product) => product.id === Number(item));
//         totalAmount += cartItems[item] * itemInfo.price;
//       }
//     }
//     return totalAmount;
//   };

//   const addToCart = (itemId) => {
//     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
//   };
//   const removeCart = (itemId) => {
//     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
//   };

//   const updateCartItemCount = (newAmount, itemId) => {
//     setCartItems((prev) => ({ ...prev, [itemId]: newAmount }));
//   };

//   const contextValue = {
//     cartItems,
//     addToCart,
//     removeCart,
//     updateCartItemCount,
//     getTotalCartAmount,
//   };

//   console.log(cartItems);
//   return (
//     <ShopContext.Provider value={contextValue}>
//       {props.children}
//     </ShopContext.Provider>
//   );
// };

// export { ShopContextProvider, ShopContext };

import React, { createContext, useEffect, useState } from "react";
import axiosDriver from "../config/axios";
import Product from "../pages/shop/Product";

const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    axiosDriver.get("http://localhost:3000/api/carts").then((response) => {
      if (response.data?.items) {
        setCartItems(response.data.items);
      }
    });
  }, []);

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

  // const getTotalCartAmount = () => {
  //   let totalAmount = 0;
  //   for (const item of cartItems) {
  //     let itemInfo = PRODUCTS.find((product) => product._id === item._id);
  //     totalAmount += item.qty * itemInfo.price;
  //   }
  //   return totalAmount;
  // };

  const addToCart = (productId) => {
    let newCartItems = [...cartItems];
    const index = getCartIndex(productId);

    if (index > -1) {
      newCartItems[index].qty += 1;
    } else {
      const product = Product.find((product) => product._id === productId);
      newCartItems.push({ _id: null, product: product, qty: 1 });
    }
    updateAPI(newCartItems);
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
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

    setCartItems(newCartItems);
  };

  const getCartQty = (productId) => {
    const index = getCartIndex(productId);
    return index > -1 ? cartItems[index].qty : null;
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeCart,
    updateCartItemCount,
    // getTotalCartAmount,
    getCartQty,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export { ShopContextProvider, ShopContext };
