import React, { useEffect, useState } from "react";
import Product from "./Product";
import "./Shop.css";
import axiosDriver from "../../config/axios";
import { MagnifyingGlass } from "phosphor-react";
import Pagination from "react-bootstrap/Pagination";

const Shop = () => {
  const [productList, setProductList] = useState([]);
  const [search, setSearch] = useState("");

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

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="shop">
      <div className="shop-title">
        <div className="search">
          <MagnifyingGlass size={28} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="products">
        {productList.map((product) => (
          <Product key={product._id} data={product} />
        ))}
      </div>
      <div>
        <Pagination>
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item>{1}</Pagination.Item>
          <Pagination.Ellipsis />

          <Pagination.Item>{10}</Pagination.Item>
          <Pagination.Item>{11}</Pagination.Item>
          <Pagination.Item active>{12}</Pagination.Item>
          <Pagination.Item>{13}</Pagination.Item>
          <Pagination.Item disabled>{14}</Pagination.Item>

          <Pagination.Ellipsis />
          <Pagination.Item>{20}</Pagination.Item>
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </div>
    </div>
  );
};

export default Shop;
