import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  };

  return (
    <nav className="bg-black text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link
            to="/"
            className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white font-extrabold">
            FitTrack
          </Link>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/"
              className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white font-extrabold hover:text-gray-200 transition duration-300"
            >
              Home
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link
                  to="/fitness"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white font-extrabold hover:text-gray-200 transition duration-300"
                >
                  Fitness
                </Link>
              </li>
              <li>
                <Link
                  to="/nutrition"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white font-extrabold hover:text-gray-200 transition duration-300"
                >
                  Nutrition
                </Link>
              </li>
              <li>
                <Link
                  to="/goals"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white hover:text-gray-200 transition duration-300 font-extrabold"
                >
                  Goals
                </Link>
              </li>
            </>
          )}
          {/* Conditionally render Log In or Log Out button */}
          <li>
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-200 transition duration-300 font-extrabold"
              >
                Log In
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-200 transition duration-300 font-extrabold"
              >
                Log Out
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
