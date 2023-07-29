import React, { useContext } from "react";
import { ShopContext } from "../../context/Shop-Context";

const CartItems = (props) => {
  const { id, productName, price, productImage } = props.data;
  const { cartItems, addToCart, removeCart, updateCartItemCount } =
    useContext(ShopContext);

  return (
    <div className="cart-items">
      <img src={productImage} />
      <div className="description">
        <p>
          <b>{productName}</b>
        </p>
        <p>${price}</p>
        <div className="countHandler">
          <button onClick={() => removeCart(id)}> - </button>
          <input
            value={cartItems[id]}
            onChange={(e) => updateCartItemCount(Number(e.target.value), id)}
          />
          <button onClick={() => addToCart(id)}> + </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
