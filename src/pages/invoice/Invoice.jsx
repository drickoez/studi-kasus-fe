import React, { useState, useEffect } from "react";
import axiosDriver from "../../config/axios";
import { useParams } from "react-router-dom";
import "./Invoice.css";

const Invoice = () => {
  const [invoice, setInvoice] = useState({});
  const { id } = useParams();

  const getInvoice = async () => {
    try {
      const response = await axiosDriver.get(
        `http://localhost:3000/api/invoices/${id}`
      );

      setInvoice(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInvoice();
  }, []);

  const handlePayment = async () => {
    try {
      console.log("Attempting to update payment status...");

      const response = await axiosDriver.put(
        `http://localhost:3000/api/invoices/${id}`,
        { payment_status: "paid" }
      );

      console.log("Payment response:", response.data);
      setInvoice((prevInvoice) => ({
        ...prevInvoice,
        payment_status: response.data.payment_status,
      }));
    } catch (error) {
      console.log("Payment error:", error);
    }
  };

  return (
    <>
      <div className="invoice">
        <h3>Invoice</h3>
        <div>
          <h3>#{invoice.order?.order_number}</h3>
          <div className="buyer">
            <h3>Nama Pembeli: {invoice.user?.name}</h3>
            <h4>
              Alamat Pengiriman:
              {`${invoice.delivery_address?.provinsi}, ${invoice.delivery_address?.kabupaten}, ${invoice.delivery_address?.kecamatan}, ${invoice.delivery_address?.kelurahan}, note: ${invoice.delivery_address?.detail}`}
            </h4>
          </div>
          <div>List produk yang dibeli :</div>
          {invoice.order && (
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama Produk</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                </tr>
              </thead>
              <tbody>
                {invoice.order?.order_items.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="total">
            <p>Subtotal: {invoice.sub_total}</p>
            <p>Delivery Fee: {invoice.delivery_fee}</p>
            <p>Total: {invoice.total}</p>
          </div>
        </div>
        {invoice.payment_status === "waiting_payment" ? (
          <div className="payment-btn">
            <h2>Pesanan anda belum dibayar</h2>
            <button onClick={handlePayment}>Bayar Sekarang</button>
          </div>
        ) : (
          <div className="payment-btn">
            <h2>Pesanan anda sudah dibayar</h2>
            <button disabled>LUNAS</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Invoice;
