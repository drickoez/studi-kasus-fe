import React, { useContext } from "react";
import { ShopContext } from "../../context/Shop-Context";

const Product = (props) => {
  const { addToCart, cartItems, getCartQty } = useContext(ShopContext);

  if (!props.data) {
    return null;
  }
  const { _id, name, price, image_url } = props.data;

  console.log(cartItems);
  return (
    <div className="product">
      <img src={`http://localhost:3000/images/products/${image_url}`} />
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>${price}</p>
      </div>
      <button className="cart-btn" onClick={() => addToCart(_id)}>
        Add To Cart {getCartQty(_id)}
      </button>
    </div>
  );
};

export default Product;
