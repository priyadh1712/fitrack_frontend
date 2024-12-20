import React, { createContext, useReducer, useContext } from "react";

const NutritionContext = createContext();

const nutritionReducer = (state, action) => {
  switch (action.type) {
    case "SET_NUTRITION":
      return {
        ...state,
        nutritionItems: action.payload,
      };
    case "ADD_NUTRITION":
      return {
        ...state,
        nutritionItems: [action.payload, ...state.nutritionItems],
      };
    case "DELETE_NUTRITION":
      return {
        ...state,
        nutritionItems: state.nutritionItems.filter(
          (item) => item.id !== action.payload
        ),
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

const initialState = {
  nutritionItems: [],
};

export const NutritionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(nutritionReducer, initialState);

  return (
    <NutritionContext.Provider value={{ ...state, dispatch }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutritionContext = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error(
      "useNutritionContext must be used within a NutritionProvider"
    );
  }
  return context;
};
