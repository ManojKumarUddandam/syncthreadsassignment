import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "../Card/Card";

import './Dashboard.css'; 

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not logged in");
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Map Views Data
  const mapOptions = [
    { id: 1, title: "🌍 World Map View", path: "/map?view=world" },
    { id: 2, title: "📍 User’s Current Location", path: "/map?view=current" },
    { id: 3, title: "🏢 City-wise Search", path: "/map?view=city" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Location-Based App</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className="mt-10 text-lg font-semibold text-gray-600">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {mapOptions.map((option) => (
            <Card key={option.id} title={option.title} onClick={() => navigate(option.path)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
