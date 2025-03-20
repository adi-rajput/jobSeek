import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get("token");
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError({ general: "Invalid or missing token" });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = data;
    let newErrors = {};

    if (!newPassword) newErrors.newPassword = "Password is required!";
    if (newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters!";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password!";
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match!";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/users/resetPassword?token=${token}`,
        { newPassword }
      );

      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset error:", error.response?.data || error);
      setError({ 
        general: error.response?.data?.message || "Failed to reset password" 
      });
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
          <p className="mt-2 text-gray-400">Enter your new password</p>
        </div>

        {error.general && (
          <div className="p-3 mb-4 text-sm text-red-200 bg-red-900 bg-opacity-50 rounded-lg">
            {error.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                name="newPassword"
                value={data.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 text-white bg-gray-700 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${
                  error.newPassword
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-blue-500"
                }`}
              />
              {error.newPassword && (
                <p className="mt-1 text-sm text-red-400">{error.newPassword}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Confirm New Password
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !token}
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
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;