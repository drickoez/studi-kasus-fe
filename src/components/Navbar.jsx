import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "phosphor-react";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setisLoggedIn(true);
    }
  }, []);

  return (
    <div className="navbar">
      <div className="links">
        <Link to="/">Shop</Link>

        {!isLoggedIn && (
          <>
            <Link to="/auth">Login</Link>
            <Link to="/auth">Register</Link>
          </>
        )}
        <Link to="/cart">
          <ShoppingCart size={32} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
