// src/UserLogin.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/users/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      console.log("Response data:", response.data); // Debug log
    } catch (error) {
      // Log the full error response to see more details
      console.error("Full error:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);

      setMessage(
        "Error submitting form: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-lg w-96"
      >
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          User Login
        </h2>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 transition duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 transition duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 text-white transition duration-200 bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Log In
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/user_register" className="text-purple-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserLogin;
