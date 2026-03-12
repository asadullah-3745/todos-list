import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(res.data.message || "Registration successful. Check your email for verification code.");
      
      // Navigate to verification page with email
      navigate("/verify", { state: { email: formData.email } });

    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      
      // Check if it's a "User already exists" error
      if (error.response?.status === 409 || message.includes("already exists")) {
        toast.error("📧 Email already registered! Please login instead.");
      } else if (error.response?.status === 400) {
        toast.error(message);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="primary" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
