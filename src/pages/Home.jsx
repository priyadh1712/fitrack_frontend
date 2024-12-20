import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles.css"; 

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow">
        <section className="fitness-banner bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 text-white text-center py-20 md:py-32">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Welcome to Fitness Tracker
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-extrabold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
            Track your workouts, nutrition, and goals seamlessly in one place.
            Join us to improve your fitness and achieve your health goals.
          </p>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-semibold text-green-500 mb-4">Track Workouts</h3>
                <p className="text-gray-700">
                  Easily log your workouts and monitor your progress over time.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-semibold text-green-500 mb-4">Monitor Nutrition</h3>
                <p className="text-gray-700">
                  Keep track of your meals, calories, and nutritional intake.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-semibold text-green-500 mb-4">Set Fitness Goals</h3>
                <p className="text-gray-700">
                  Set personal fitness goals and track your progress toward achieving them.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black text-white text-center py-12 md:py-20">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to take your fitness journey to the next level?
          </h2>
          <p className="text-lg mb-8">
            Join thousands of others and start tracking your fitness today!
          </p>
          {!isLoggedIn && (
            <a
              href="/signup"
              className="bg-white text-green-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition duration-300"
            >
              Get Started
            </a>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
