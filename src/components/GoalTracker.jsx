import React from "react";

const NutritionDetails = ({ nutrition }) => {
  return (
    <div className="bg-green-50 shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-bold text-green-800">{nutrition.name}</h3>
      <p className="text-gray-600 mt-2">
        <span className="font-semibold">Calories:</span> {nutrition.calories} kcal
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Proteins:</span> {nutrition.proteins} g
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Fats:</span> {nutrition.fats} g
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Carbohydrates:</span> {nutrition.carbohydrates} g
      </p>
      <p className="text-gray-500 text-sm mt-4">
        Logged on: {new Date(nutrition.loggedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default NutritionDetails;
