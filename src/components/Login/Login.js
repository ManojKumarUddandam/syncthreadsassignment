import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Make sure to import the CSS

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Make the API call to login
      const response = await axios.post('https://syncthreadsassignment-1.onrender.com/api/login', { username, password });

      // Store the JWT token in localStorage upon successful login
      localStorage.setItem('token', response.data.token);

      // Redirect to the dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      // Display specific error message if login fails
      setError(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <h1>Login</h1>
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
        <button onClick={handleLogin}>Login</button>
        
        {error && <div className="error-message">{error}</div>}
        
        <p>
          Don't have an account? <button onClick={() => navigate('/signup')}>Signup</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
