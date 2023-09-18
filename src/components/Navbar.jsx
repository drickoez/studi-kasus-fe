import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import { GearSix, HandbagSimple, House } from "phosphor-react";

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
      <div className="navbar-title">
        <h1>AXIA SHOP</h1>
      </div>
      <div className="links">
        <NavLink to="/" activeclassname="active">
          <h4>
            <House size={21} /> Home
          </h4>
        </NavLink>

        <h4>
          <GearSix size={21} /> Pengaturan
        </h4>
        <div className="link-setting">
          <NavLink to="/products" activeclassname="active">
            Data Produk
          </NavLink>
          <NavLink to="/tags" activeclassname="active">
            Data Tag
          </NavLink>
          <NavLink to="/categories" activeclassname="active">
            Data Kategori
          </NavLink>
          <NavLink to="/address" activeclassname="active">
            Data Alamat
          </NavLink>
        </div>
        <NavLink to="/orders" activeclassname="active">
          <h4>
            <HandbagSimple size={21} /> Transaksi
          </h4>
        </NavLink>

        {!isLoggedIn ? (
          <>
            <Link to="/auth">
              <button>Login</button>
            </Link>
          </>
        ) : (
          <Link to="/auth">
            <button>Logout</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
