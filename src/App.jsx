import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Shop from "./pages/shop/Shop";
import Cart from "./pages/cart/Cart";
import { ShopContextProvider } from "./context/Shop-Context";
import Auth from "./pages/auth/Auth";
import Products from "./pages/products/Products";
import Categories from "./pages/categories/Categories";
import Tags from "./pages/tags/Tags";
import Order from "./pages/order/Order";
import Invoice from "./pages/invoice/Invoice";
import Address from "./pages/address/Address";

function App() {
  return (
    <>
      <div className="App">
        <ShopContextProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/edit-category/:id" element={<Categories />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/edit-tags/:id" element={<Tags />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/invoices/:id" element={<Invoice />} />
              <Route path="/address" element={<Address />} />
            </Routes>
          </Router>
        </ShopContextProvider>
      </div>
    </>
  );
}

export default App;
