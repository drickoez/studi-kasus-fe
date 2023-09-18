import React, { useState, useEffect } from "react";
import axiosDriver from "../../config/axios";
import "./Tags.css";
import { Link, useNavigate } from "react-router-dom";

const Tags = () => {
  const [tagList, setTagList] = useState([]);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTagId, setEditTagId] = useState(null);
  const [editName, setEditName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await axiosDriver.get(
          "http://localhost:3000/api/tags"
        );
        if (response.status === 200) {
          setTagList(response.data);
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    getTags();
  }, []);

  const handleAdd = async () => {
    try {
      const addTags = { name };
      const response = await axiosDriver.post(
        "http://localhost:3000/api/tags",
        addTags
      );
      // Update the categoryList state directly to include the new category
      setTagList([...tagList, response.data]);
      navigate("/tags");
      setName(""); // Clear the name field after adding
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (tagId) => {
    try {
      await axiosDriver.delete(`http://localhost:3000/api/tags/${tagId}`);
      setTagList(tagList.filter((tag) => tag._id !== tagId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (tagId, tagName) => {
    setIsEditing(true);
    setEditTagId(tagId);
    setEditName(tagName);
  };

  const handleSaveEdit = async (tagId) => {
    try {
      const updatedTag = { name: editName };
      const response = await axiosDriver.put(
        `http://localhost:3000/api/tags/${tagId}`,
        updatedTag
      );

      // Update the categoryList with the updated category
      const updatedList = tagList.map((tag) =>
        tag._id === tagId ? response.data : tag
      );
      setTagList(updatedList);

      // Reset the edit state
      setIsEditing(false);
      setEditTagId(null);
      setEditName("");
      navigate("/tags");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="tag">
      <h1>Tag List</h1>
      <div className="add-tag">
        <input
          type="text"
          placeholder="Enter tag name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="add-button" onClick={handleAdd}>
          Add Tag
        </button>
      </div>
      <ul className="tag-list">
        {tagList.map((tag) => (
          <li key={tag._id} className="tag-item">
            {isEditing && editTagId === tag._id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            ) : (
              <h3>{tag.name}</h3>
            )}
            <div className="button">
              {isEditing && editTagId === tag._id ? (
                <button
                  className="save-button"
                  onClick={() => handleSaveEdit(tag._id)}
                >
                  Save
                </button>
              ) : (
                <Link
                  to={`/edit-tags/${tag._id}`}
                  className="edit-button"
                  onClick={() => handleEdit(tag._id, tag.name)}
                >
                  Edit
                </Link>
              )}
              <button
                className="delete-button"
                onClick={() => handleDelete(tag._id)}
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

export default Tags;
