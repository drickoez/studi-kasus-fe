import React, { useEffect, useState } from "react";
import { PRODUCTS } from "../../products";
import Product from "./Product";
import "./Shop.css";
import axios from "axios";
import axiosDriver from "../../config/axios";

const Shop = () => {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await axiosDriver.get(
      "http://localhost:3000/api/products"
    );
    console.log(response);
    if (response.data.error !== 1) {
      setProductList(response.data.data);
    }
  };

  return (
    <div className="shop">
      <div className="shop-title">
        <h1>Axia Shop</h1>
      </div>
      <div className="products">
        {productList.map((product) => (
          <Product key={product._id} data={product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
