import React from "react";

import './Card.css';

const Card = ({ title, onClick }) => {
  return (
    <div
      className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:bg-gray-200 transition"
      onClick={onClick}
    >
      <h2 className="text-xl font-semibold text-center">{title}</h2>
    </div>
  );
};

export default Card;
