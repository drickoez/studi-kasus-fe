import React, { useEffect, useState } from "react";
import ProductsItems from "./Products-items";
import "./Products.css";
import axios from "axios";
import axiosDriver from "../../config/axios";
import { MagnifyingGlass } from "phosphor-react";

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    tags: "",
  });
  const [newProductImage, setNewProductImage] = useState(null);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
    fetchTags();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosDriver.get(
        "http://localhost:3000/api/products"
      );
      console.log(response);
      if (response.data.error !== 1) {
        setProductList(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axiosDriver.get("http://localhost:3000/api/tags");
      console.log(response);
      if (response.data.error !== 1) {
        setTags(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosDriver.get(
        "http://localhost:3000/api/categories"
      );
      console.log(response);
      if (response.data.error !== 1) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewProductImage = (e) => {
    setNewProductImage(e.target.files[0]);
  };

  const handleAddProduct = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewProduct({
      name: "",
      price: 0,
      description: "",
      category: "",
      tags: "",
    });
  };

  const handleNewProduct = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNewProduct = async () => {
    const formData = new FormData();
    formData.append("image", newProductImage);
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);
    formData.append("tags", newProduct.tags);

    if (editProduct) {
      const response = await axiosDriver.put(
        `http://localhost:3000/api/products/${editProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.error !== 1) {
        const updatedProductList = productList.map((product) =>
          product._id === editProduct._id ? response.data.data : product
        );
        setProductList(updatedProductList);
        handleCloseModal();
      }
    } else {
      const response = await axiosDriver.post(
        "http://localhost:3000/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.error !== 1) {
        setProductList([...productList, response.data.data]);
        handleCloseModal();
      }
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowModal(true);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      tags: product.tags,
    });
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
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <div className="products">
        {productList.map((product) => (
          <ProductsItems
            key={product._id}
            data={product}
            onEdit={() => handleEditProduct(product)}
            onDelete={() => handleDelete(product._id)}
          />
        ))}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Product</h2>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleNewProduct}
              />
              <label htmlFor="price">Price:</label>
              <input
                type="text"
                name="price"
                value={newProduct.price}
                onChange={handleNewProduct}
              />
              <label htmlFor="description">Description:</label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleNewProduct}
              />
              <label htmlFor="price">Category:</label>
              <select
                name="category"
                value={newProduct.category}
                onChange={handleNewProduct}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <label htmlFor="price">Tags:</label>
              <select
                name="tags"
                value={newProduct.tags}
                onChange={handleNewProduct}
              >
                <option value="">Select tags</option>
                {tags.map((tag) => (
                  <option key={tag._id} value={tag._id}>
                    {tag.name}
                  </option>
                ))}
              </select>
              <label htmlFor="image">Image:</label>
              <input
                type="file"
                name="image"
                onChange={handleNewProductImage}
              />
              <div className="modal-buttons">
                <button onClick={handleCloseModal}>Cancel</button>
                <button onClick={handleAddNewProduct}>Add Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
