import React, { useState, useEffect } from "react";
import "./Auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosDriver from "../../config/axios";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/auth/me");
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoggedIn();
  }, []);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: email,
        password: password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsLoggedIn(true); // Update isLoggedIn state after successful login
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        handleLogin();
      } else {
        console.log("Registration error:", response.data);
      }
    } catch (error) {
      console.log("Network error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cartItems");
        setIsLoggedIn(false); // Update isLoggedIn state after successful logout
        navigate("/");
      } else {
        console.log("Logout error:", response.data);
      }
    } catch (error) {
      console.log("Network error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  if (isLoggedIn) {
    return (
      <div className="form-container">
        <h1>Logout?</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  } else {
    return (
      <div className="form-container">
        <h1>{isLogin ? "Login" : "Register"}</h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
          <p onClick={handleToggleForm}>
            {isLogin ? "Create an account" : "Already have an account? Login"}
          </p>
        </form>
      </div>
    );
  }
};

export default Auth;
