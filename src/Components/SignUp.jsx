import { useState, useEffect } from "react";
import "../App.css";

function SignUp({ onSignUp, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  // Check username availability
  useEffect(() => {
    if (username.trim()) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const exists = users.some((user) => user.username === username);
      setUsernameAvailable(!exists);
    } else {
      setUsernameAvailable(true);
    }
  }, [username]);

  // Evaluate password strength
  useEffect(() => {
    if (!password) return setPasswordStrength("");

    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[\W_]/.test(password)
    ) {
      setPasswordStrength("strong");
    } else {
      setPasswordStrength("medium");
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate inputs
      if (!username || !email || !password || !confirmPassword) {
        throw new Error("All fields are required");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (!usernameAvailable) {
        throw new Error("Username is already taken");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      onSignUp(newUser); // Notify parent
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthClass = () => {
    return {
      weak: "password-weak",
      medium: "password-medium",
      strong: "password-strong",
    }[passwordStrength] || "";
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={!usernameAvailable ? "input-error" : ""}
              disabled={loading}
              required
            />
            {!usernameAvailable && (
              <div className="input-feedback error">Username is taken</div>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            {password && (
              <div className={`password-strength ${getPasswordStrengthClass()}`}>
                Strength: {passwordStrength}
                <div className="strength-meter">
                  <div
                    className={`strength-meter-fill ${getPasswordStrengthClass()}`}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={
                confirmPassword && password !== confirmPassword ? "input-error" : ""
              }
              disabled={loading}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="input-feedback error">Passwords don't match</div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading || !usernameAvailable}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="toggle-form">
          Already have an account?{" "}
          <button onClick={switchToLogin} disabled={loading} className="toggle-btn">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
