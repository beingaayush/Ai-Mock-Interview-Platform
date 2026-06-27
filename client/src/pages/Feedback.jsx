import React from 'react';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Interview Report</h2>
      <p>Your Score: 8/10</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default Feedback;