import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { UserDetails } from "../pages/UserDetails";
import { CartManager } from "../pages/CartManager";
import Header from "../components/Header/Header";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          {/* Main page with QRScanner */}
          <Route path="/user-details" element={<UserDetails />} />
          {/* User details page */}
          <Route path="/cart" element={<CartManager />} />
          {/* User cart manager page */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
