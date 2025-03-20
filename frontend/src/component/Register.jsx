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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setError({ ...error, [name]: "" }); 
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

    setIsLoading(true);

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
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (error) {
      console.error("Error in register:", error.response?.data || error.message);
      
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        
        let newErrors = {};
        if (errorMessage === "Email already exists") {
          newErrors.email = "This email is already registered!";
        } else {
          newErrors.general = "Registration failed! Please try again.";
        }
        setError(newErrors);
      } else {
        toast.error("Server error, try again!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md p-8 m-4 overflow-hidden bg-gray-800 border border-gray-700 shadow-2xl rounded-3xl backdrop-blur-sm bg-opacity-90">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Create Account
          </h2>
          <p className="mt-2 text-gray-400">Join our platform today</p>
        </div>

        {error.general && (
          <div className="p-3 mb-4 text-sm text-red-200 bg-red-900 bg-opacity-50 rounded-lg">
            {error.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 text-white bg-gray-700 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                  error.name
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-blue-500"
                }`}
              />
              {error.name && (
                <p className="mt-1 text-sm text-red-400">{error.name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`w-full px-4 py-3 text-white bg-gray-700 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                  error.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-blue-500"
                }`}
              />
              {error.email && (
                <p className="mt-1 text-sm text-red-400">{error.email}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 text-white bg-gray-700 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                  error.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-blue-500"
                }`}
              />
              {error.password && (
                <p className="mt-1 text-sm text-red-400">{error.password}</p>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 text-white bg-gray-700 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                  error.confirmPassword
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-blue-500"
                }`}
              />
              {error.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {error.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Select Role
            </label>
            <div className="relative mt-1">
              <select
                name="role"
                value={data.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-white bg-gray-700 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                  error.role
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-blue-500"
                }`}
              >
                <option value="">Choose a role</option>
                <option value="User">User</option>
                <option value="Employer">Employer</option>
              </select>
              {error.role && (
                <p className="mt-1 text-sm text-red-400">{error.role}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-base font-medium text-white transition-all duration-200 transform bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 hover:scale-105 disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        {/* Link to Login */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;