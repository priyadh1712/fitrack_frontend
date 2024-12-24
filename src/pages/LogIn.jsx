import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext"; 
import fitnessImage from "../images/fitness-3.jpg"; 

const LogIn = () => {
  const { setIsAuthenticated } = useAuthContext(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      console.log("Attempting Login with Form Data:", formData);

      // Simulating backend API
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, userId } = data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);
        setIsAuthenticated(true); 
        navigate("/");
    }  else {
        throw new Error(data.message || "Failed to login.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
      style={{
        backgroundImage: `url(${fitnessImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        opacity: 0.8,
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-5xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-100">
          FitTrack
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 hover:underline transition duration-300"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
