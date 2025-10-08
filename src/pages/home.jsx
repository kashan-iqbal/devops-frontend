import { useState, useEffect } from "react";
import "./home.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const response = await fetch(
        `${import.meta.env.backendurl}/api/products/api/products`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      // fallback mock data
      setProducts([
        {
          _id: "68e0ef36c123846091c85277",
          name: "Motorbike",
          price: 98000,
          createdBy: "68e0d3b8da61b1455ca8d813",
        },
        {
          _id: "68e0ef39c123846091c85279",
          name: "Car",
          price: 450000,
          createdBy: "68e0d3b8da61b1455ca8d813",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const response = await fetch(
        `${import.meta.env.backendurl}/api/products/api/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName,
            price: Number(newPrice),
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to create product");
      }

      // Close dialog
      setShowDialog(false);
      setNewName("");
      setNewPrice("");

      // Refresh product list
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading products...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Products</h1>
        <p style={styles.subtitle}>Browse our collection of products</p>
        <button style={styles.addButton} onClick={() => setShowDialog(true)}>
          + Add Product
        </button>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          {error} - Showing mock data for demonstration
        </div>
      )}

      <div style={styles.productsGrid}>
        {products.map((product) => (
          <div key={product._id} style={styles.productCard}>
            <div style={styles.productImage}>
              <div style={styles.imagePlaceholder}>🏍️</div>
            </div>
            <div style={styles.productInfo}>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productPrice}>{formatPrice(product.price)}</p>
              <div style={styles.productMeta}>
                <span style={styles.metaLabel}>Created By:</span>{" "}
                {product.createdBy?.slice(-8)}
              </div>
              <button style={styles.button}>View Details</button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div style={styles.emptyState}>
          <p>No products found</p>
        </div>
      )}

      {/* Add Product Dialog */}
      {showDialog && (
        <div style={styles.dialogOverlay}>
          <div style={styles.dialogBox}>
            <h2 style={styles.dialogTitle}>Add New Product</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Product name"
              style={styles.input}
            />
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Product price"
              style={styles.input}
            />
            <div style={styles.dialogActions}>
              <button style={styles.button} onClick={handleCreateProduct}>
                Save
              </button>
              <button
                style={styles.cancelButton}
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "40px 20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#667eea",
    padding: "60px 20px",
  },
  errorBanner: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "12px 20px",
    borderRadius: "8px",
    marginBottom: "30px",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto 30px",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  productImage: {
    width: "100%",
    height: "200px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    fontSize: "80px",
  },
  productInfo: {
    padding: "20px",
  },
  productName: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  productPrice: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#667eea",
    marginBottom: "16px",
  },
  productMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
  },
  metaItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
  },
  metaLabel: {
    color: "#666",
    fontWeight: "500",
  },
  metaValue: {
    color: "#333",
    fontWeight: "600",
    fontFamily: "monospace",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    fontSize: "18px",
    color: "#999",
  },
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .productCard:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
  }
  button:hover {
    transform: scale(1.02) !important;
  }
  button:active {
    transform: scale(0.98) !important;
  }
`;
document.head.appendChild(styleSheet);
