import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    // only login returns token
    if (!isRegister) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.user.email); // ✅ FIX
    navigate("/"); // better than window.location.href


    } else {
      alert("Registered successfully! Now login.");
      setIsRegister(false);
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

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="auth-btn">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

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
