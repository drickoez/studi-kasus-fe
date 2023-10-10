import React, { useContext, useState, useEffect } from "react";
import axiosDriver from "../../config/axios";
import { useNavigate } from "react-router-dom";

const ProductsItems = (props) => {
  const [editProduct, setEditProduct] = useState(null);

  if (!props.data) {
    return null;
  }
  const { _id, name, price, image_url } = props.data;
  const navigate = useNavigate();

  const handleEdit = () => {
    setEditProduct(_id);
    props.onEdit();
  };

  const handleDelete = async () => {
    const response = await axiosDriver.delete(
      `http://localhost:3000/api/products/${_id}`
    );
    if (response.data.error !== 1) {
      const updatedProductList = productList.filter(
        (product) => product._id !== _id
      );
      setProductList(updatedProductList);
      navigate("/products");
    }
  };

  return (
    <div className="product">
      <img src={`http://localhost:3000/images/products/${image_url}`} />
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>Rp {price}</p>
      </div>
      <div className="button">
        <button className="edit-button" onClick={() => handleEdit(_id)}>
          Edit
        </button>
        <button className="delete-button" onClick={() => handleDelete(_id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductsItems;
