import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Ensure the path is correct

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Basic form validation
    if (!username || !password) {
      setError('Both username and password are required');
      return;
    }

    try {
      setLoading(true); // Show loading state
      setError(''); // Clear any previous errors
      const response = await axios.post('https://syncthreadsassignment-1.onrender.com/api/signup', { username, password });
      alert(response.data.message); // Assuming the response contains a message
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false); // Hide loading state after request completes
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Signup</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup} disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
        
        {error && <div className="error-message">{error}</div>}
        
        <p>
          Already have an account? <button onClick={() => navigate('/login')}>Login</button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
