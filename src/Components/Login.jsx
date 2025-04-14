import { useState, useEffect } from "react";
import "../App.css";

function Login({ onLogin, switchToSignUp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUser");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        throw new Error("Please fill in all fields");
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        if (rememberMe) {
          localStorage.setItem("rememberedUser", username);
        } else {
          localStorage.removeItem("rememberedUser");
        }
        onLogin(user);
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : "Login"}
          </button>
        </form>

        <p className="toggle-form">
          Don't have an account?{" "}
          <button
            type="button"
            className="toggle-btn"
            onClick={switchToSignUp}
            disabled={loading}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;