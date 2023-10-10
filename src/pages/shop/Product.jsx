import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../context/Shop-Context";
import { Link } from "react-router-dom";
import { ShoppingCart, ShoppingCartSimple } from "phosphor-react";

const Product = (props) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setisLoggedIn(true);
    }
  }, []);

  const { addToCart, cartItems, getCartQty } = useContext(ShopContext);

  if (!props.data) {
    return null;
  }
  const { _id, name, price, image_url } = props.data;

  console.log(cartItems);
  return (
    <div className="product">
      <Link className="detail" to={`/products/${_id} `} key={_id}>
        <img src={`http://localhost:3000/images/products/${image_url}`} />
      </Link>
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>Rp {price}</p>
      </div>
      {isLoggedIn ? (
        <button className="cart-btn" onClick={() => addToCart(_id)}>
          <ShoppingCartSimple size={17} /> {getCartQty(_id)}
        </button>
      ) : (
        <button className="cart-btn" disabled>
          Login to Add to Cart
        </button>
      )}
      {cartItems.length > 0 && (
        <Link to="/cart" className="shopping-cart">
          <h3>Cart</h3>
          <ShoppingCart size={32} />
        </Link>
      )}
    </div>
  );
};

export default Product;
