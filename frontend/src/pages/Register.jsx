import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    const nextErrors = {};
    if (!form.username.trim() || form.username.trim().length < 3) {
      nextErrors.username = "Username must be at least 3 characters";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Valid email is required";
    }
    if (!form.password || form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form.username.trim(), form.email.trim(), form.password);
      navigate("/");
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="floating one"></div>
      <div className="floating two"></div>
      <div className="floating three"></div>

      {/* LEFT SIDE (same as login) */}
      <div className="login-left">
        <div className="logo-circle">🌐</div>

        <h1>ProFiber</h1>

        <h2>Connecting You to a Faster Tomorrow.</h2>

        <p>
          Create an admin account to manage customers, internet plans, billing,
          and support in one dashboard.
        </p>
      </div>

      {/* RIGHT CARD (same structure as login-card) */}
      <div className="login-card">
        <h2>Create Account</h2>

        <p className="subtitle">Register a new admin account</p>

        {apiError && <div className="alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter Username"
            />
            {errors.username && <small>{errors.username}</small>}
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter Email"
            />
            {errors.email && <small>{errors.email}</small>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter Password"
            />
            {errors.password && <small>{errors.password}</small>}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="register-link">
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
