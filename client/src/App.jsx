import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';


// Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div 
        className="navbar-brand" 
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="9" width="3" height="6" rx="1.5" fill="#6366f1"/>
          <rect x="8" y="5" width="3" height="14" rx="1.5" fill="#818cf8"/>
          <rect x="13" y="2" width="3" height="20" rx="1.5" fill="#c7d2fe"/>
          <rect x="18" y="7" width="3" height="10" rx="1.5" fill="#818cf8"/>
        </svg>
        AI Interviewer
      </div>
      
      {token && (
        <div className="navbar-user">
          <span>Hi, {userName}</span>
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      © 2026 Aayush Kumar. All rights reserved |
      <a href="https://github.com/beingaayush/Ai-Mock-Interview-Platform" target="_blank" rel="noopener noreferrer"> Github</a>
    </footer>
  );
};


// Route Guard
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar /> {/* <-- Har page ke upar Navbar dikhega */}
      
      <div className="main-content"> {/* <-- Isse saare cards properly center me aayenge */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/setup" element={<PrivateRoute><RoleSelection /></PrivateRoute>} />
          <Route path="/interview" element={<PrivateRoute><Interview /></PrivateRoute>} />
          <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;