import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = data;
    let errors = {};

    if (!email) errors.email = "Email is required!";
    if (!password) errors.password = "Password is required!";
    if (!confirmPassword) errors.confirmPassword = "Confirm password!";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match!";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch(() => {
        setData({ email: "", password: "", confirmPassword: "" });
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md p-8 m-4 overflow-hidden bg-gray-800 border border-gray-700 shadow-2xl rounded-3xl backdrop-blur-sm bg-opacity-90">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-gray-400">Sign in to your account</p>

        {error && <p className="p-3 mb-4 text-sm text-red-200 bg-red-900 bg-opacity-50 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-white bg-gray-700 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                formErrors.email ? "border-red-500 focus:ring-red-400" : "border-gray-600 focus:ring-blue-500"
              }`}
              placeholder="name@example.com"
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-white bg-gray-700 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                formErrors.password ? "border-red-500 focus:ring-red-400" : "border-gray-600 focus:ring-blue-500"
              }`}
              placeholder="••••••••"
            />
            {formErrors.password && <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-white bg-gray-700 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                formErrors.confirmPassword ? "border-red-500 focus:ring-red-400" : "border-gray-600 focus:ring-blue-500"
              }`}
              placeholder="••••••••"
            />
            {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-400">{formErrors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2">
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
