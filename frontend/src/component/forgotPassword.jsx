import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError("Email is required!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/forgotPassword",
        { email }
      );

      console.log("Response:", response.data);
      setSuccess(true);
      toast.success("Password reset email sent! Check your inbox.", {
        position: "top-right",
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        
        if (errorMessage === "User not found") {
          setError("No account found with this email address.");
        } else {
          setError("Failed to send reset email. Please try again.");
        }
      } else {
        setError("Server error. Please try again later.");
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
            Reset Password
          </h2>
          <p className="mt-2 text-gray-400">
            {success
              ? "Check your email for reset instructions"
              : "Enter your email to receive a reset link"}
          </p>
        </div>

        {success ? (
          <div className="p-4 mb-6 text-sm text-green-200 bg-green-900 bg-opacity-50 rounded-lg">
            <p>
              A password reset link has been sent to <strong>{email}</strong>.
            </p>
            <p className="mt-2">
              Please check your inbox and follow the instructions in the email.
            </p>
            <p className="mt-2">
              The reset link will expire in 10 minutes for security reasons.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full px-4 py-3 text-white bg-gray-700 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                    error
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-600 focus:ring-blue-500"
                  }`}
                />
                {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
              </div>
            </div>

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
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            <Link
              to="/login"
              className="font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              Back to Login
            </Link>
          </p>
          {!success && (
            <p className="mt-2 text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-gray-400 transition-colors hover:text-gray-300"
              >
                Sign up
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;