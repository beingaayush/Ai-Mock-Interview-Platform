import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!role.trim()) return alert("Please enter a Job Role first!");
    const userId = localStorage.getItem('userId');
    console.log("Sending userId to backend:", userId);
  
    if (!userId) {
    alert("User not found! Please login again.");
    navigate('/login');
    return;
    }
    setLoading(true);
    try {
      // sending request to backend
      const response = await axios.post('http://localhost:5000/api/interview/start-session', {
        userId,
        role,
        experience
      });

      // After receiving the data from the API, we will send it to the interview page
      // We are passing data within the 'state' so that we can use it in next page
      navigate('/interview', {
        state: {
          sessionId: response.data.sessionId,
          currentQuestion: response.data.question
        }
      });
    } catch (error) {
      console.error("API Error:", error);
      alert("Error connecting to backend! Make sure your Node server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Interview Setup</h2>
      
      <div className="form-group">
        <label>Job Role:</label>
        <input 
          type="text" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. React Developer, Java Backend..."
        />
      </div>

      <div className="form-group">
        <label>Experience Level:</label>
        <select value={experience} onChange={(e) => setExperience(e.target.value)}>
          <option value="Fresher">Fresher (0-1 yrs)</option>
          <option value="Mid-Level">Mid-Level (2-4 yrs)</option>
          <option value="Senior">Senior (5+ yrs)</option>
        </select>
      </div>

      <button onClick={handleStart} disabled={loading}>
        {loading ? 'Starting AI Engine...' : 'Start Interview'}
      </button>
    </div>
  );
};

export default RoleSelection;