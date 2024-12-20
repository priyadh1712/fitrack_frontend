import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from './context/AuthContext'; 
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Fitness from "./pages/Fitness";
import Nutrition from "./pages/Nutrition";
import Goals from "./pages/Goals";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
