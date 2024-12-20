import { useContext } from "react";
import { NutritionContext } from "../context/NutritionContext";

export const useNutritionContext = () => {
  const context = useContext(NutritionContext);

  if (!context) {
    throw new Error("useNutritionContext must be used within a NutritionContextProvider");
  }

  return context;
};
