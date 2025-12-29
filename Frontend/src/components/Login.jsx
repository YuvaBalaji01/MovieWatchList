import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false); // 🔄 loader
  const [error, setError] = useState("");        // ❌ error message

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isRegister
      ? `${API_BASE_URL}/api/auth/register`
      : `${API_BASE_URL}/api/auth/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // ✅ LOGIN SUCCESS
      if (!isRegister) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.user.email);
        onLogin();
        navigate("/", { replace: true });
      } 
      // ✅ REGISTER SUCCESS
      else {
        alert("Registered successfully! Please login.");
        setIsRegister(false);
      }

    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        <p className="auth-subtitle">
          {isRegister
            ? "Register to start tracking movies"
            : "Login to manage your watchlist"}
        </p>

        {/* ❌ ERROR MESSAGE */}
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* 🔄 SWITCH LOGIN / REGISTER */}
        <p className="auth-toggle" onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? "Already have an account? Login"
            : "New user? Register"}
        </p>
      </div>
    </div>
  );
};

export default Login;
