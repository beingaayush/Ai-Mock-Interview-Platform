import React from 'react';
import { useNavigate } from 'react-router-dom';

const Interview = () => {
  const navigate = useNavigate();

  const handleEnd = () => {
    navigate('/feedback');
  };

  return (
    <div className="container">
      <h2>Live Interview</h2>
      {/* Yahan wave animation aur voice aayega */}
      <div className="ai-wave">AI is listening...</div> 
      <button onClick={handleEnd}>End Interview & Get Report</button>
    </div>
  );
};

export default Interview;