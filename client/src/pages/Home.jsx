import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  // Retrieving user details from local storage.
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.clear(); // remove all saved data
    navigate('/login');
  };

  return (
    <div className="container">
      <h1>AI Mock Interview Platform</h1>
      
      {token ? (
        <>
          <p>Welcome back, <strong>{userName}</strong>!</p>
          <button onClick={() => navigate('/setup')} style={{ marginBottom: '10px' }}>
            Start New Interview
          </button>
        </>
      ) : (
        <>
          <p>Practice your interviews with our smart AI.</p>
          <button onClick={() => navigate('/login')} style={{ marginBottom: '10px' }}>
            Login to Start
          </button>
          <button onClick={() => navigate('/signup')} style={{ backgroundColor: '#28a745' }}>
            Create an Account
          </button>
        </>
      )}
    </div>
  );
};

export default Home;