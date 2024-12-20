import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Goals = () => {
  const [goals, setGoals] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");
  const [newGoal, setNewGoal] = useState({
    goalType: "",
    targetValue: "",
    currentValue: "",
    startDate: "",
    endDate: "",
    description: "",
  }); 
  const [isEditing, setIsEditing] = useState(false); 
  const [editingGoalId, setEditingGoalId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/goals`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setGoals(data);
        } else {
          setError("Failed to fetch goals.");
        }
      } catch (error) {
        setError("Error fetching goals: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: value,
    });
  };

  const handleSubmitGoal = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const url = isEditing
      ? `${process.env.REACT_APP_BASE_URL}/api/goals/${editingGoalId}`
      : `${process.env.REACT_APP_BASE_URL}/api/goals`;

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newGoal),
      });

      if (response.ok) {
        const goalData = await response.json();
        if (isEditing) {
          setGoals(goals.map((goal) => (goal._id === editingGoalId ? goalData : goal)));
        } else {
          setGoals([...goals, goalData]);
        }
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add/update goal");
      }
    } catch (error) {
      setError("Error adding/updating goal: " + error.message);
    }
  };

  const resetForm = () => {
    setNewGoal({
      goalType: "",
      targetValue: "",
      currentValue: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setIsEditing(false); 
    setEditingGoalId(null); 
  };

  const handleDeleteGoal = async (goalId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/goals/${goalId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setGoals(goals.filter((goal) => goal._id !== goalId)); 
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete goal");
      }
    } catch (error) {
      setError("Error deleting goal: " + error.message);
    }
  };

  const handleEditGoal = (goal) => {
    setNewGoal({
      goalType: goal.goalType,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      startDate: goal.startDate,
      endDate: goal.endDate,
      description: goal.description,
    });
    setIsEditing(true); 
    setEditingGoalId(goal._id); 
  };

  const generateChartData = (goal) => {
    const progress = (goal.currentValue / goal.targetValue) * 100; 

    return {
      labels: [goal.goalType],
      datasets: [
        {
          label: "Progress",
          data: [progress],
          backgroundColor: progress < 50 ? "rgb(255, 99, 132)" : "rgb(75, 192, 192)",
          borderColor: progress < 50 ? "rgb(255, 99, 132)" : "rgb(75, 192, 192)",
          borderWidth: 1,
        },
      ],
      options: {
        scales: {
          y: {
            beginAtZero: true, 
            min: 0,
            max: 100, 
          },
        },
      },
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow">
        <section className="fitness-banner text-center py-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-white">Goals</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-extrabold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
          Set and track your Goals to stay motivated and achieve more!
          </p>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">Your Goals</h2>
            {loading && (
              <div className="text-center text-lg font-semibold text-gray-700">
                Loading goals...
              </div>
            )}
            {error && (
              <div className="text-center text-lg font-semibold text-red-600">
                {error}
              </div>
            )}
            {!loading && !error && goals.length === 0 && (
              <div className="text-center text-lg font-semibold text-gray-700">
                No goals found. Start adding your goals!
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {goals.map((goal) => (
                <div
                  key={goal._id}
                  className="bg-white p-8 rounded-xl shadow-md text-center"
                >
                  <h3 className="text-xl font-semibold text-teal-500 mb-4">
                    {goal.goalType.charAt(0).toUpperCase() + goal.goalType.slice(1)}
                  </h3>
                  <p className="text-gray-700">Target: {goal.targetValue}</p>
                  <p className="text-gray-700">Current: {goal.currentValue}</p>
                  <p className="text-gray-700">
                    Start Date: {new Date(goal.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    End Date: {new Date(goal.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mt-2">{goal.description}</p>

                  <div className="mt-4">
                    <Bar data={generateChartData(goal)} />
                  </div>

                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-teal-500 text-white px-4 py-2 rounded-md mr-2"
                      onClick={() => handleEditGoal(goal)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                      onClick={() => handleDeleteGoal(goal._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <form
              onSubmit={handleSubmitGoal}
              className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {isEditing ? "Edit Goal" : "Add New Goal"}
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="goalType"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Goal Type
                </label>
                <select
                  id="goalType"
                  name="goalType"
                  value={newGoal.goalType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Goal Type</option>
                  <option value="daily steps">Daily Steps</option>
                  <option value="weekly workout sessions">Weekly Workout Sessions</option>
                  <option value="calorie intake">Calorie Intake</option>
                  <option value="hydration">Hydration</option>
                  <option value="sleep duration">Sleep Duration</option>
                  <option value="weight management">Weight Management</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="targetValue"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Target Value
                </label>
                <input
                  type="number"
                  id="targetValue"
                  name="targetValue"
                  value={newGoal.targetValue}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="currentValue"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Current Value
                </label>
                <input
                  type="number"
                  id="currentValue"
                  name="currentValue"
                  value={newGoal.currentValue}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="startDate"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={newGoal.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="endDate"
                  className="block text-lg font-semibold text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={newGoal.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newGoal.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>
              <div className="mb-4 text-center">
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-6 py-2 rounded-md shadow-md"
                >
                  {isEditing ? "Update Goal" : "Add Goal"}
                </button>
              </div>
              {error && <p className="text-red-600 text-center">{error}</p>}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Goals;
