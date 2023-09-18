import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../context/Shop-Context";
import CartItems from "./Cart-Items";
import "./Cart.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosDriver from "../../config/axios";

const Cart = () => {
  const { cartItems, resetCart } = useContext(ShopContext);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Check if the user is already logged in
    const getAddress = async () => {
      try {
        const response = await axiosDriver.get(
          "http://localhost:3000/api/delivery-addresses"
        );
        if (response.status === 200) {
          setAddressList(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAddress();
  }, []);

  const handleCheckout = async () => {
    try {
      const response = await axiosDriver.post(
        "http://localhost:3000/api/orders",
        {
          delivery_fee: deliveryFee,
          delivery_address: selectedAddress,
        }
      );
      resetCart();
      navigate(`/invoices/${response.data._id}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const selectAddress = (e) => {
    setSelectedAddress(e.target.value);
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );

  const deliveryFee = 10000;

  return (
    <div className="carts">
      <div className="cart">
        <h3>Keranjang Belanja</h3>
        <div className="cart">
          {cartItems.map((cartItem) => {
            return <CartItems data={cartItem.product} />;
          })}
        </div>
      </div>
      <hr className="line" />
      <div className="payment">
        <h3>Pembayaran</h3>
        <div className="dropdown">
          <div className="dropdown-address">
            <h3>Alamat</h3>
            <select onChange={selectAddress}>
              <option value="">Silahkan pilih alamat anda...</option>
              {addressList.map((address) => {
                return (
                  <option value={address._id}>
                    <div>
                      <p>
                        {address.nama} <br />
                      </p>
                      <p>
                        {`${address.kelurahan}, ${address.kecamatan}, ${address.kabupaten}, ${address.provinsi}`}{" "}
                        <br />
                      </p>
                      <p>{address.detail}</p>
                    </div>
                  </option>
                );
              })}
            </select>
          </div>
          <div className="dropdown-payment">
            <h3>Metode Pembayaran</h3>
            <select>
              <option value="">Silahkan pilih pembayaran anda...</option>
              <option value="virtual-account">Virtual Account</option>
              <option value="qris">QRIS</option>
              <option value="bank">Transfer Bank</option>
            </select>
          </div>
        </div>
        <div className="detail">
          <h3>Detail</h3>
          <h4>Subtotal: Rp {totalAmount}</h4>
          <h4>Delivery Fee: Rp {deliveryFee}</h4>
          <hr />
          <h4>Total: Rp {totalAmount + deliveryFee}</h4>
          <br />
          {totalAmount > 0 ? (
            <div className="checkout">
              <button onClick={() => navigate("/")}>Continue Shopping</button>

              <button disabled={!selectedAddress} onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          ) : (
            <div className="empty-cart">
              <h1>Your Cart is Empty</h1>
              <button onClick={() => navigate("/")}>Continue Shopping</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
