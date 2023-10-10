import React, { useEffect, useState } from "react";
import Product from "./Product";
import "./Shop.css";
import axiosDriver from "../../config/axios";
import { MagnifyingGlass } from "phosphor-react";
import Box from "@mui/material/Box";
import { Pagination } from "@mui/material";
import { useMemo } from "react";
import Detail from "./Detail";
import { Link, useNavigate } from "react-router-dom";

const Shop = () => {
  const [productList, setProductList] = useState([]);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState();
  const [category, setCategory] = useState([]);
  const [tag, setTag] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [skip, setSkip] = useState(0);
  const perPage = 10;
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const options = ["All Categories", ...category];

  const navigate = useNavigate();

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

  const handleChange = (event, value) => {
    setPage(value);
    setSkip((value - 1) * perPage);
  };

  useEffect(() => {
    let apiUrl = `http://localhost:3000/api/products?skip=${skip}&limit=${perPage}`;

    axiosDriver.get(apiUrl).then((res) => {
      setProductList(res.data.data);
      setTotalPage(Math.ceil(res.data.count / perPage));
    });
  }, [skip, perPage]);

  useEffect(() => {
    axiosDriver.get("http://localhost:3000/api/categories").then((res) => {
      setCategory(res.data);
    });
  }, []);

  useEffect(() => {
    axiosDriver.get("http://localhost:3000/api/tags").then((res) => {
      setTag(res.data);
    });
  }, []);

  const filterProductList = useMemo(() => {
    // Filter products based on search and selected tags
    let filteredProducts = productList.filter((product) => {
      return (
        product.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedTags.length === 0 ||
          product.tags.some((tag) => selectedTags.includes(tag.id)))
      );
    });

    if (selectedOption === "By Categories") {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filteredProducts;
  }, [productList, search, selectedOption, selectedTags]);

  const handleProductClick = (product) => {
    setSelectedProductId(product);
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tagId)) {
        return prevTags.filter((id) => id !== tagId);
      } else {
        return [...prevTags, tagId];
      }
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
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">All Categories</option>
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="products">
        {filterProductList.map((product) => (
          <Product
            key={product._id}
            data={product}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </div>
      <div className="tags-filter">
        <h3>Filter by Tags:</h3>
        {tag.map((tagItem) => (
          <label key={tagItem.id}>
            <input
              type="checkbox"
              id={`tag-${tagItem.id}`}
              name={`tag-${tagItem.id}`}
              checked={selectedTags.includes(tagItem.id)}
              onChange={() => handleTagChange(tagItem.id)}
            />
            {tagItem.name}
          </label>
        ))}
      </div>

      {selectedProductId && <Detail product={selectedProductId} />}

      <Box
        sx={{
          margin: "auto",
          width: "fit-content",
          alignItems: "center",
        }}
      >
        <Pagination
          className="pagination"
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

export default Shop;
