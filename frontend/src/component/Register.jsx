import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setError({ ...error, [name]: "" }); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User Data:", data);
    const { name, email, password, confirmPassword, role } = data;
    let newErrors = {};
    
    if (!name) newErrors.name = "Name is required!";
    if (!email) newErrors.email = "Email is required!";
    if (!password) newErrors.password = "Password is required!";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password!";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match!";
    if (!role) newErrors.role = "Select a role!";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v1/users/register", {
        name,
        email,
        password,
        role,
      });

      console.log("Response:", response.data);
      toast.success("User registered successfully! Redirecting...", {
        position: "top-right",
        autoClose: 2000, // Toast disappears in 2 sec
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500); // Redirect after toast

    } catch (error) {
      console.error("Error in register:", error);
      toast.error("Server error, try again!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-6 bg-gray-900 shadow-lg rounded-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-center text-white">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={`w-full px-4 py-2 mt-1 text-white bg-gray-800 border rounded-md focus:ring-2 focus:outline-none ${
                error.name ? "border-red-500" : "border-gray-700"
              }`}
            />
            {error.name && <p className="text-sm text-red-500">{error.name}</p>}
          </div>

          {/* Email */}
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
            {error.email && <p className="text-sm text-red-500">{error.email}</p>}
          </div>

          {/* Password */}
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
            {error.password && <p className="text-sm text-red-500">{error.password}</p>}
          </div>

          {/* Confirm Password */}
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
            {error.confirmPassword && <p className="text-sm text-red-500">{error.confirmPassword}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-300">Select Role</label>
            <select
              name="role"
              value={data.role}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 text-white bg-gray-800 border rounded-md focus:ring-2 focus:outline-none ${
                error.role ? "border-red-500" : "border-gray-700"
              }`}
            >
              <option value="">Choose a role</option>
              <option value="contractor">Contractor</option>
              <option value="organization">Organization</option>
            </select>
            {error.role && <p className="text-sm text-red-500">{error.role}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>

        {/* Link to Login */}
        <p className="mt-4 text-center text-gray-400">
          Have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
