import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";
import "../styles.css"

// Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const Nutrition = () => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [nutritionGoal, setNutritionGoal] = useState(0);
  const [newLog, setNewLog] = useState({
    foodItem: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    servingSize: "",
    mealType: "breakfast",
    date: "",
  });
  const [goalInput, setGoalInput] = useState("");
  const [error, setError] = useState(null);

  const fetchNutritionLogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/nutrition`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNutritionLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch nutrition logs:", error);
      setError("Failed to fetch nutrition logs. Please try again.");
    }
  };

  const fetchNutritionGoal = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/nutrition/goal`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNutritionGoal(response.data.dailyCaloriesGoal || 0);
    } catch (error) {
      console.error("Failed to fetch nutrition goal:", error);
      setError("Failed to fetch nutrition goal. Please try again.");
    }
  };

  const addNutritionLog = async () => {
    try {
      const optimisticLog = { ...newLog, _id: Date.now() };
      setNutritionLogs((prevLogs) => [...prevLogs, optimisticLog]);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/nutrition/add`,
        newLog,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchNutritionLogs();
      setNewLog({
        foodItem: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        servingSize: "",
        mealType: "breakfast",
        date: "",
      });
    } catch (error) {
      console.error("Failed to add nutrition log:", error);
      setError("Failed to add nutrition log. Please try again.");
    }
  };

  const updateNutritionGoal = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/nutrition/goal`,
        { dailyCaloriesGoal: goalInput },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Nutrition goal updated successfully!");
      setNutritionGoal(goalInput);
      setGoalInput("");
    } catch (error) {
      console.error("Failed to update nutrition goal:", error);
      setError("Failed to update nutrition goal. Please try again.");
    }
  };

  const deleteNutritionLog = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/nutrition/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchNutritionLogs();
    } catch (error) {
      console.error("Failed to delete nutrition log:", error);
      setError("Failed to delete nutrition log. Please try again.");
    }
  };

  useEffect(() => {
    fetchNutritionLogs();
    fetchNutritionGoal();
  }, []);

  const calculateNutritionSummary = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    nutritionLogs.forEach((log) => {
      totalCalories += parseFloat(log.calories || 0);
      totalProtein += parseFloat(log.protein || 0);
      totalCarbs += parseFloat(log.carbs || 0);
      totalFats += parseFloat(log.fats || 0);
    });

    return { totalCalories, totalProtein, totalCarbs, totalFats };
  };

  const { totalCalories, totalProtein, totalCarbs, totalFats } = calculateNutritionSummary();

  const chartData = {
    labels: ["Calories", "Protein", "Carbs", "Fats"],
    datasets: [
      {
        data: [totalCalories, totalProtein, totalCarbs, totalFats],
        backgroundColor: ["#FF5733", "#33C3FF", "#9CFF33", "#FF9133"], 
        hoverBackgroundColor: ["#FF5733", "#33C3FF", "#9CFF33", "#FF9133"],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow">
        <section className="nutrition-banner text-center py-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-white">Nutrition Tracking</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-extrabold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
            Log your meals and set goals to maintain a balanced diet.
          </p>
        </section>

        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Nutrition Goal</h2>
            <p className="text-lg mb-6">Daily Calorie Goal: {nutritionGoal || "Not set"}</p>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Set daily calorie goal"
                className="p-2 border rounded w-full"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
              />
              <button
                onClick={updateNutritionGoal}
                className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600"
              >
                Update Goal
              </button>
            </div>
          </div>
        </section>

        <section className="py-10 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nutrition Summary</h2>
            <div className="chart-container">
              <Doughnut data={chartData} />
            </div>
            <p className="mt-4 text-lg font-semibold">Total Calories: {totalCalories}</p>
            <p className="mt-2 text-lg font-semibold">Total Protein: {totalProtein}g</p>
            <p className="mt-2 text-lg font-semibold">Total Carbs: {totalCarbs}g</p>
            <p className="mt-2 text-lg font-semibold">Total Fats: {totalFats}g</p>
          </div>
        </section>

        <section className="py-10 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Nutrition Log</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(newLog).map((key) => (
                <input
                  key={key}
                  type={key === "date" ? "date" : "text"}
                  name={key}
                  value={newLog[key]}
                  placeholder={`Enter ${key}`}
                  className="p-2 border rounded"
                  onChange={(e) => setNewLog({ ...newLog, [key]: e.target.value })}
                />
              ))}
            </div>
            <button
              onClick={addNutritionLog}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Add Log
            </button>
          </div>
        </section>

        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nutrition Logs</h2>
            {nutritionLogs.length > 0 ? (
              nutritionLogs.map((log) => (
                <div
                  key={log._id}
                  className="bg-gray-50 p-4 rounded shadow-md mb-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg">{log.foodItem}</h3>
                    <p>Calories: {log.calories}</p>
                    <p>Protein: {log.protein}g</p>
                    <p>Carbs: {log.carbs}g</p>
                    <p>Fats: {log.fats}g</p>
                    <p>Meal Type: {log.mealType}</p>
                    <p>Date: {new Date(log.date).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => deleteNutritionLog(log._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No logs found. Start adding your meals!</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Nutrition;
