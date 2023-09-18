import React, { useEffect, useState } from "react";
import axiosDriver from "../../config/axios";
import "./Order.css";
import { Link } from "react-router-dom";

const Order = () => {
  const [orderList, setOrderList] = useState([]);

  const getOrder = async () => {
    try {
      const response = await axiosDriver.get(
        "http://localhost:3000/api/orders"
      );
      const sortedOrders = response.data.data.sort(
        (a, b) => a.order_number - b.order_number
      );
      setOrderList(sortedOrders);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div className="main">
      <h3>Transaksi</h3>
      <table className="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Order Items</th>
            <th>Total Items</th>
            <th>Delivery Address</th>
            <th>Delivery Fee</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr key={order._id}>
              <td>{order.order_number}</td>
              <td>
                {order.order_items.map((item) => (
                  <div key={item._id}>{item.name}</div>
                ))}
              </td>
              <td>{order.items_count}</td>
              <td>{`${order.delivery_address.provinsi}, ${order.delivery_address.kabupaten}, ${order.delivery_address.kecamatan}, ${order.delivery_address.kelurahan}, note: ${order.delivery_address.detail}`}</td>
              <td>{order.delivery_fee}</td>
              <td>
                <div className="status">
                  {order.status}
                  <Link to={`/invoices/${order._id}`} className="pay-btn">
                    Bayar
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
