// src/components/GuestUserCard.jsx

import React from 'react';
import axios from 'axios';

const GuestUserCard = () => {
  const handleGuestLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/guest/guestLogin', 
        {}, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

    if (response.status === 200) {
        alert('Guest login successful! Redirecting...');
        window.location.href = '/guest_dashboard';
      }
    }
    catch (error) {
      console.error('Error during guest login:', error);
      alert('Error logging in as a guest.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm p-6 mt-8 transition-transform transform bg-white rounded-lg shadow-lg hover:scale-105">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Guest User</h2>
      <p className="mb-4 text-center text-gray-600">
        Explore as a guest user. Browse jobs without registering!
      </p>
      <button
        onClick={handleGuestLogin}
        className="w-full p-2 text-center text-white bg-purple-600 rounded-lg hover:bg-purple-700"
      >
        Guest Login
      </button>
    </div>
  );
};

export default GuestUserCard;
