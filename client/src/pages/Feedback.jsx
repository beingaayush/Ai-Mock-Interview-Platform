import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // The report data sent from the interview page will be received here.
  const { report } = location.state || {};

  if (!report) {
    return (
      <div className="container">
        <h2>No Report Found</h2>
        <p>Please complete an interview first.</p>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', textAlign: 'left' }}>
      <h2 style={{ textAlign: 'center' }}>Interview Final Report</h2>

      {/* SCORE & SUMMARY */}
      <div style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#818cf8' }}>Overall Score: {report.score}/10</h3>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#e2e8f0' }}>Summary:</p>
        <p style={{ margin: '5px 0 0 0', color: '#cbd5e1' }}>{report.summary}</p>
      </div>

      {/* STRENGTHS */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ color: '#28a745', marginBottom: '5px' }}>✅ Strengths:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {report.strengths?.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>

      {/* WEAKNESSES */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ color: '#dc3545', marginBottom: '5px' }}>❌ Weaknesses:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {report.weaknesses?.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>

      {/* IMPROVEMENT AREAS */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#ffc107', marginBottom: '5px' }}>💡 Areas for Improvement:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {report.improvementAreas?.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>

      <button onClick={() => navigate('/')} style={{ width: '100%' }}>
        Back to Home
      </button>
    </div>
  );
};

export default Feedback;