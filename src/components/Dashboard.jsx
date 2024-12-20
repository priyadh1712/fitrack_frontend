import React from 'react';
import Navbar from './Navbar';  
import Footer from './Footer';

const Dashboard = () => {
  return (
    <div className="dashboard-container bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <div className="content-container flex-grow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <p className="text-gray-700">Proceed to Other Pages</p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
