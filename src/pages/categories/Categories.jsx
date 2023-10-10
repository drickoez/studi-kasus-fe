import React, { useState, useEffect } from "react";
import axiosDriver from "../../config/axios";
import "./Categories.css";
import { Link, useNavigate } from "react-router-dom";

const Categories = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editName, setEditName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosDriver.get(
          "http://localhost:3000/api/categories"
        );
        if (response.status === 200) {
          setCategoryList(response.data);
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    getCategories();
  }, []);

  const handleAdd = async () => {
    try {
      const addCategory = { name };
      const response = await axiosDriver.post(
        "http://localhost:3000/api/categories",
        addCategory
      );

      setCategoryList([...categoryList, response.data]);
      navigate("/categories");
      setName(""); // Clear the name field after adding
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (categoryId) => {
    try {
      await axiosDriver.delete(
        `http://localhost:3000/api/categories/${categoryId}`
      );
      setCategoryList(
        categoryList.filter((category) => category._id !== categoryId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (categoryId, categoryName) => {
    setIsEditing(true);
    setEditCategoryId(categoryId);
    setEditName(categoryName);
  };

  const handleSaveEdit = async (categoryId) => {
    try {
      const updatedCategory = { name: editName };
      const response = await axiosDriver.put(
        `http://localhost:3000/api/categories/${categoryId}`,
        updatedCategory
      );

      // Update the categoryList with the updated category
      const updatedList = categoryList.map((category) =>
        category._id === categoryId ? response.data : category
      );
      setCategoryList(updatedList);

      // Reset the edit state
      setIsEditing(false);
      setEditCategoryId(null);
      setEditName("");
      navigate("/categories");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="category">
      <h1>Category List</h1>
      <div className="add-category">
        <input
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="addC-button" onClick={handleAdd}>
          Add Category
        </button>
      </div>
      <ul className="category-list">
        {categoryList.map((category) => (
          <li key={category._id} className="category-item">
            {isEditing && editCategoryId === category._id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            ) : (
              <h3>{category.name}</h3>
            )}
            <div className="button">
              {isEditing && editCategoryId === category._id ? (
                <button
                  className="save-button"
                  onClick={() => handleSaveEdit(category._id)}
                >
                  Save
                </button>
              ) : (
                <Link
                  to={`/edit-category/${category._id}`}
                  className="edit-button"
                  onClick={() => handleEdit(category._id, category.name)}
                >
                  Edit
                </Link>
              )}
              <button
                className="delete-button"
                onClick={() => handleDelete(category._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
