import React, { useEffect, useState } from "react";
import axiosDriver from "../../config/axios";
import "./Order.css";
import { Link } from "react-router-dom";
import { Box, Pagination } from "@mui/material";

const Order = () => {
  const [orderList, setOrderList] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [page, setPage] = useState(1);
  const [skip, setSkip] = useState(0);
  const perPage = 4;

  const handleChange = (event, value) => {
    setPage(value);
    setSkip((value - 1) * perPage);
  };

  useEffect(() => {
    let apiUrl = `http://localhost:3000/api/orders?skip=${skip}&limit=${perPage}`;

    axiosDriver.get(apiUrl).then((res) => {
      setOrderList(res.data.data);
      setTotalPage(Math.ceil(res.data.count / perPage));
    });
  }, [skip, perPage]);

  const getOrder = async () => {
    try {
      const response = await axiosDriver.get(
        "http://localhost:3000/api/orders"
      );
      // const sortedOrders = response.data.data.sort(
      //   (a, b) => a.order_number - b.order_number
      // );
      setOrderList(response.data.data);
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

                  {order.status === "waiting_payment" ? (
                    <Link to={`/invoices/${order._id}`} className="pay-btn">
                      Bayar
                    </Link>
                  ) : (
                    <Link to={`/invoices/${order._id}`} className="pay-btn">
                      Invoice
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Box
        sx={{
          margin: "auto",
          width: "fit-content",
          alignItems: "center",
        }}
      >
        <Pagination
          className="pagination-table"
          count={totalPage}
          page={page}
          onChange={handleChange}
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </div>
  );
};

export default Order;
