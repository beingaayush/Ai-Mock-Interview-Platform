import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>AI Mock Interview Platform</h1>
      <p>Practice your interviews with our smart AI.</p>
      <button onClick={() => navigate('/setup')}>Get Started</button>
    </div>
  );
};

export default Home;