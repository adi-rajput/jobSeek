import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setError({ ...error, [name]: "" }); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = data;
    let newErrors = {};

    if (!email) newErrors.email = "Email is required!";
    if (!password) newErrors.password = "Password is required!";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password!";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match!";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/login",
        {
          email,
          password,
        }
      );

      console.log("Response:", response.data);
      toast.success("User logged in successfully! Redirecting...", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;

        let newErrors = {};
        if (errorMessage === "User not found") {
          newErrors.email = "Email not found!.";
        } else if (errorMessage === "Invalid credentials") {
          newErrors.password = "Incorrect password! Try again.";
        } else {
          newErrors.general = "Login failed! Please check your credentials.";
        }
        setError(newErrors);

        setData({
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-6 bg-gray-900 shadow-lg rounded-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-center text-white">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300">Email Address</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 mt-1 text-white bg-gray-800 border rounded-md focus:ring-2 focus:outline-none ${
                error.email ? "border-red-500" : "border-gray-700"
              }`}
            />
            {error.email && (
              <p className="text-sm text-red-500">{error.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 mt-1 text-white bg-gray-800 border rounded-md focus:ring-2 focus:outline-none ${
                error.password ? "border-red-500" : "border-gray-700"
              }`}
            />
            {error.password && (
              <p className="text-sm text-red-500">{error.password}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full px-4 py-2 mt-1 text-white bg-gray-800 border rounded-md focus:ring-2 focus:outline-none ${
                error.confirmPassword ? "border-red-500" : "border-gray-700"
              }`}
            />
            {error.confirmPassword && (
              <p className="text-sm text-red-500">{error.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          No account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
