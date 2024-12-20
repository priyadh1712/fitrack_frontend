import React, { createContext, useReducer, useContext } from "react";

export const ExerciseContext = createContext();

const exerciseReducer = (state, action) => {
  switch (action.type) {
    case "SET_EXERCISES":
      return {
        ...state,
        exercises: action.payload,
      };
    case "ADD_EXERCISE":
      return {
        ...state,
        exercises: [action.payload, ...state.exercises],
      };
    case "DELETE_EXERCISE":
      return {
        ...state,
        exercises: state.exercises.filter(
          (exercise) => exercise.id !== action.payload
        ),
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

const initialState = {
  exercises: [],
};

export const ExerciseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(exerciseReducer, initialState);

  return (
    <ExerciseContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExerciseContext = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error(
      "useExerciseContext must be used within an ExerciseProvider"
    );
  }
  return context;
};
