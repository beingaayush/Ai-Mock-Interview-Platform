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
    // Component mount hone par recognition setup karein
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true; // Isse mic apne aap band nahi hoga
      recog.interimResults = false; // Sirf final words dikhayega
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
      // Jo naya bola gaya hai, usko existing answer me add karo
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
    if (isListening) recognition.stop(); // Submit karte waqt mic band kar do
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/interview/next-question', {
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
    <div className="container">
      <h2>Live Interview</h2>
      
      <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{question}</p>

      {/* WAVE ANIMATION */}
      {isAISpeaking && (
        <div className="ai-wave-container">
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
        </div>
      )}

      <div className="form-group" style={{ marginTop: '20px' }}>
        <textarea 
          rows="4" 
          value={answer} 
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your spoken answer will appear here... (You can also type)"
          style={{ width: '100%', padding: '10px', borderRadius: '6px' }}
        />
      </div>

      {isListening && <p className="recording-status">🔴 Listening... (Click Stop when done)</p>}

      {/* CONTROLS */}
      <button 
        onClick={toggleListening} 
        disabled={isAISpeaking || loading}
        style={{ 
          backgroundColor: isListening ? '#dc3545' : '#28a745', 
          marginRight: '10px' 
        }}
      >
        {isListening ? '🛑 Stop Listening' : '🎤 Speak Answer'}
      </button>

      <button onClick={handleSubmit} disabled={loading || isAISpeaking}>
        {loading ? 'Submitting...' : 'Submit Answer'}
      </button>

    </div>
  );
};

export default Interview;