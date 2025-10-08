import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/api/auth/login`;
      console.log(url, `host`, import.meta.env.VITE_BACKEND_URL);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      console.log(response);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Save token to localStorage
      localStorage.setItem("token", data.token);

      // Redirect to product page
      navigate("/product");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Please login to your account</p>

        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={styles.footer}>
          <Link to={"/register"} style={styles.link}>
            Register
          </Link>
          <span style={styles.divider}>•</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: "20px",
  },
  loginBox: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "8px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
    textAlign: "center",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "12px 16px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },
  button: {
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  error: {
    padding: "12px",
    backgroundColor: "#fee",
    color: "#c33",
    borderRadius: "6px",
    fontSize: "14px",
    textAlign: "center",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
  },
  divider: {
    margin: "0 12px",
    color: "#ddd",
  },
};

// Add hover effects via CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
  button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
  }
  button:active {
    transform: translateY(0) !important;
  }
  a:hover {
    text-decoration: underline !important;
  }
`;
document.head.appendChild(styleSheet);
