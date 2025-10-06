import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ProductsPage from "./pages/home";

function App() {
  return (
    <Router>
      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product" element={<ProductsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
