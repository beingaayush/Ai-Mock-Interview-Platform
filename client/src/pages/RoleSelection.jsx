import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Backend API call here later
    navigate('/interview');
  };

  return (
    <div className="container">
      <h2>Select Role & Experience</h2>
      <button onClick={handleStart}>Start Interview</button>
    </div>
  );
};

export default RoleSelection;