import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles.css"; 

const Fitness = () => {
  const [fitnessData, setFitnessData] = useState([]); 
  const [totalCalories, setTotalCalories] = useState(0); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");
  const [newExercise, setNewExercise] = useState({
    type: "",
    duration: "",
    distance: "",
    calories: "",
  }); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFitnessData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/exercises`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setFitnessData(data);
          
          const total = data.reduce((acc, exercise) => acc + parseFloat(exercise.calories), 0);
          setTotalCalories(total);
        } else {
          setError("Failed to fetch exercises.");
        }
      } catch (error) {
        setError("Error fetching exercises: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFitnessData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise({
      ...newExercise,
      [name]: value,
    });
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExercise),
      });

      if (response.ok) {
        const newData = await response.json();
        setFitnessData([...fitnessData, newData]); 
        setTotalCalories((prev) => prev + parseFloat(newData.calories)); 
        setNewExercise({
          type: "",
          duration: "",
          distance: "",
          calories: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add exercise");
      }
    } catch (error) {
      setError("Error adding exercise: " + error.message);
    }
  };

  const progressPercentage = (totalCalories / 6000) * 100; 

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow">
        <section className="fitness-banner text-center py-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-white">Fitness Tracking</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-extrabold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
            Track your exercises and progress as you work towards your fitness goals!
          </p>
        </section>

        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-4 text-gray-800">Progress</h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="font-semibold inline-block py-1 px-2 uppercase text-teal-600">
                    Calories Burned
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold inline-block py-1 px-2 uppercase text-teal-600">
                    {totalCalories} / 6000 kcal
                  </span>
                </div>
              </div>
              <div className="flex mb-2">
                <div className="w-full bg-gray-200 rounded-full">
                  <div
                    className="bg-teal-500 text-xs leading-none py-1 text-center text-teal-100"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">Your Exercises</h2>
            {loading && (
              <div className="text-center text-lg font-semibold text-gray-700">
                Loading exercises...
              </div>
            )}
            {error && (
              <div className="text-center text-lg font-semibold text-red-600">
                {error}
              </div>
            )}
            {!loading && !error && fitnessData.length === 0 && (
              <div className="text-center text-lg font-semibold text-gray-700">
                No exercises found. Start adding your exercises!
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fitnessData.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-white p-8 rounded-xl shadow-md text-center"
                >
                  <h3 className="text-xl font-semibold text-orange-500 mb-4">{exercise.type}</h3>
                  <p className="text-gray-700">Duration: {exercise.duration} min</p>
                  <p className="text-gray-700">Distance/Count: {exercise.distance} km/reps</p>
                  <p className="text-gray-700">Calories: {exercise.calories} kcal</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">Add a New Exercise</h2>
            <form onSubmit={handleAddExercise} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Type</label>
                <select
                  name="type"
                  value={newExercise.type}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Exercise Type</option>
                  <option value="Running">Running</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Bicep Curls">Bicep Curls</option>
                  <option value="Squats">Squats</option>
                  <option value="Deadlifts">Deadlifts</option>
                  <option value="Push-ups">Push-ups</option>
                  <option value="Pull-ups">Pull-ups</option>
                  <option value="Lunges">Lunges</option>
                  <option value="Bench Press">Bench Press</option>
                  <option value="Leg Press">Leg Press</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Duration (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={newExercise.duration}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Distance/Count (km/reps)</label>
                <input
                  type="number"
                  name="distance"
                  value={newExercise.distance}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">Calories</label>
                <input
                  type="number"
                  name="calories"
                  value={newExercise.calories}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300"
              >
                Add Exercise
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Fitness;
