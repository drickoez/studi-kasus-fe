import React, { useContext, useEffect, useState } from "react";
import axiosDriver from "../../config/axios";
import "./Shop.css";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/Shop-Context";

const Detail = () => {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const { addToCart } = useContext(ShopContext);

  const fetchProductDetail = async () => {
    try {
      const response = await axiosDriver.get(
        `http://localhost:3000/api/products/${params.id}`
      );
      console.log(response);
      if (response.data) {
        setProduct(response.data);
      } else {
        console.log("No product data found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [params.id]);

  const handleClose = () => {
    navigate("/");
  };

  const handleAddToCart = () => {
    addToCart(product._id);
    handleClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          {product ? (
            <>
              <img src={product.image_url} alt="image" />
              <h2>{product.name}</h2>
              <p>Price: Rp {product.price}</p>
              <p>Description: {product.description}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
          <div className="button-container">
            <button onClick={handleClose}>Close</button>
            <button onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
