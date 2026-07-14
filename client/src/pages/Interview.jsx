import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { sessionId, currentQuestion } = location.state || {};

  const [question, setQuestion] = useState(currentQuestion || "Loading question...");
  const [answer, setAnswer] = useState("");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  // Web Speech API Initialization
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Set up recognition once the component is mounted.
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true; // This will not turn off the mic automatically..
      recog.interimResults = false; // will show only the final words
      setRecognition(recog);
    }
  }, []);

  useEffect(() => {
    if (question) {
      speakQuestion(question);
    }
  }, [question]);

  // AI TEXT TO SPEECH
  const speakQuestion = (text) => {
    if (!window.speechSynthesis) return alert("Browser does not support text-to-speech!");
    
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => setIsAISpeaking(true);
    utterance.onend = () => setIsAISpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // USER SPEECH TO TEXT TOGGLE (START/STOP)
  const toggleListening = () => {
    if (!recognition) return alert("Your browser doesn't support speech recognition. Try Google Chrome.");

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      // Add what has been newly stated to the existing answer.
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      if (event.error === 'not-allowed') {
        alert("Please allow Microphone access in your browser settings (Top left near URL).");
      }
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // SUBMIT ANSWER TO BACKEND
  const handleSubmit = async () => {
    if (!answer.trim()) return alert("Please answer the question before submitting.");
    if (isListening) recognition.stop(); // while submiting turn off the mic
    
    setLoading(true);
    try {
      // const response = await axios.post('http://localhost:5000/api/interview/next-question', {
      //   sessionId,
      //   question,
      //   answer
      // });
      
      // Vite automatically import.meta.env se variables uthata hai
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
      const response = await axios.post(`${API_URL}/api/interview/next-question`, {
        sessionId,
        question,
        answer
      });

      if (response.data.isCompleted) {
        navigate('/feedback', { state: { report: response.data.report } });
      } else {
        setQuestion(response.data.nextQuestion);
        setAnswer(""); // Clear box for next answer
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Error submitting answer.");
    } finally {
      setLoading(false);
    }
  };

  if (!sessionId) return <div className="container">Please start from the Home page.</div>;

  return (
    <div className="interview-grid">
      
      {/* ================= LEFT COLUMN (AI) ================= */}
      <div className="ai-column">
        <h3 style={{ color: '#818cf8', marginBottom: '20px' }}>AI Interviewer</h3>
        
        {/* Naya Bada Animation */}
        <div className={`ai-wave-large ${isAISpeaking ? 'speaking' : ''}`}>
          <div className="wave-bar-large"></div>
          <div className="wave-bar-large"></div>
          <div className="wave-bar-large"></div>
          <div className="wave-bar-large"></div>
          <div className="wave-bar-large"></div>
        </div>

        <p style={{ 
          marginTop: '20px', 
          fontWeight: '600', 
          color: isAISpeaking ? '#c7d2fe' : '#64748b' 
        }}>
          {isAISpeaking ? '🎙️ AI is speaking...' : 'Waiting...'}
        </p>
      </div>


      {/* ================= RIGHT COLUMN (USER) ================= */}
      <div className="qa-column">
        <h2 style={{ marginBottom: '25px' }}>Live Interview</h2>
        
        {/* AI's Question properties */}
        <p style={{ 
          fontWeight: '600', 
          fontSize: '1.1rem', 
          color: '#f1f5f9', 
          backgroundColor: 'rgba(0,0,0,0.2)', 
          padding: '15px', 
          borderRadius: '8px',
          borderLeft: '4px solid #818cf8'
        }}>
          {question}
        </p>

        {/* User's Answer box' */}
        <div className="form-group" style={{ flexGrow: 1, marginTop: '20px' }}>
          <textarea 
            value={answer} 
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your spoken answer will appear here... (You can also type)"
            style={{ 
              width: '100%', 
              height: '100%', 
              minHeight: '150px',
              padding: '15px', 
              borderRadius: '8px',
              resize: 'none'
            }}
          />
        </div>

        {isListening && <p className="recording-status">🔴 Recording your answer...</p>}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
          <button 
            onClick={toggleListening} 
            disabled={isAISpeaking || loading}
            style={{ 
              background: isListening ? '#ef4444' : 'transparent',
              border: '2px solid #818cf8',
              color: isListening ? 'white' : '#818cf8',
              boxShadow: 'none'
            }}
          >
            {isListening ? '🛑 Stop Recording' : '🎤 Speak Answer'}
          </button>

          <button onClick={handleSubmit} disabled={loading || isAISpeaking}>
            {loading ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Interview;