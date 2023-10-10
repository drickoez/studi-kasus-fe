import React, { useContext } from "react";
import { ShopContext } from "../../context/Shop-Context";

const CartItems = (props) => {
  const { _id, name, price, image_url } = props.data;
  const { cartItems, addToCart, removeCart, updateCartItemCount } =
    useContext(ShopContext);

  const handleItemCountChange = (e) => {
    const newAmount = Number(e.target.value);
    updateCartItemCount(newAmount, _id);
  };

  const cartItem = cartItems.find((item) => item._id === _id);
  const cartQty = cartItem ? cartItem.qty : 0;

  return (
    <div className="cart-items">
      <img src={`http://localhost:3000/images/products/${image_url}`} />
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>Rp {price}</p>
        <div className="countHandler">
          <button onClick={() => removeCart(_id)}> - </button>
          <input
            type="number"
            value={cartQty}
            onChange={handleItemCountChange}
          />
          <button onClick={() => addToCart(_id)}> + </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
