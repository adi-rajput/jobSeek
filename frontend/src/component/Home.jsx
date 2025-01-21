// src/WelcomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import GuestUserCard from './guest_login';
const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-purple-500 to-blue-500">
      <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
        Welcome to JobSeek
      </h1>
      <p className="mb-8 text-lg text-white sm:text-xl lg:text-2xl">
        Your dream job is just a click away!
      </p>
      <div className="flex flex-col items-center space-y-8 md:flex-row md:space-x-8 md:space-y-0">
        {/* User Card */}
        <div className="flex flex-col items-center justify-center w-full max-w-sm p-6 transition-transform transform bg-white rounded-lg shadow-lg hover:scale-105">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Job Seeker</h2>
          <p className="mb-4 text-center text-gray-600">
            Sign up to find your dream job or log in to continue your journey!
          </p>
          <Link
            to="/user_register"
            className="w-full p-2 mb-2 text-center text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Register
          </Link>
          <Link
            to="/user_login"
            className="w-full p-2 text-center text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-100"
          >
            Log In
          </Link>
        </div>

        {/* Employer Card */}
        <div className="flex flex-col items-center justify-center w-full max-w-sm p-6 transition-transform transform bg-white rounded-lg shadow-lg hover:scale-105">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Employer</h2>
          <p className="mb-4 text-center text-gray-600">
            Create an account to post jobs or log in to manage your listings!
          </p>
          <Link
            to="/employer_register"
            className="w-full p-2 mb-2 text-center text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Register
          </Link>
          <Link
            to="/employer_login"
            className="w-full p-2 text-center text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-100"
          >
            Log In
          </Link>
        </div>
      </div>
         <GuestUserCard />
    </div>
  );
};

export default WelcomePage;
