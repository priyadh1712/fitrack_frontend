import React from "react";

const WorkoutDetails = ({ workout }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-bold text-gray-800">{workout.title}</h3>
      <p className="text-gray-600 mt-2">
        <span className="font-semibold">Reps:</span> {workout.reps}
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Load:</span> {workout.load} kg
      </p>
      <p className="text-gray-500 text-sm mt-4">
        Added on: {new Date(workout.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default WorkoutDetails;
