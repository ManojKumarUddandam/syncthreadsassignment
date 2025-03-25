require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS Configuration
const allowedOrigins = [
  'https://mapintegrationmanoj.netlify.app',
  'http://localhost:3000' // For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  next();
});

// JWT Configuration
const SECRET_KEY = process.env.JWT_SECRET || 'your_very_secure_secret_key_123!';
const users = []; // In-memory storage for demo purposes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  if (err.name === 'CORSError') {
    return res.status(403).json({ 
      error: 'CORS Error',
      message: err.message 
    });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'Something went wrong!' 
  });
});

// Routes
app.post('/api/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Username and password are required' 
      });
    }

    const userExists = users.some(u => u.username === username);
    if (userExists) {
      return res.status(409).json({ 
        error: 'Conflict',
        message: 'User already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = { 
      id: users.length + 1, 
      username, 
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      user: { 
        id: newUser.id, 
        username: newUser.username 
      }
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Username and password are required' 
      });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid credentials' 
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    res.json({ 
      success: true,
      token,
      user: { 
        id: user.id, 
        username: user.username 
      }
    });
  } catch (err) {
    next(err);
  }
});

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: 'Invalid or expired token' 
        });
      }
      
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authorization header missing' 
    });
  }
};

// Protected Routes
app.get('/api/dashboard', authenticateJWT, (req, res) => {
  res.json({ 
    success: true,
    cards: [
      { id: 1, title: 'World Map View', path: '/map?view=world' },
      { id: 2, title: "User's Current Location", path: '/map?view=current' },
      { id: 3, title: 'City-wise Search', path: '/map?view=city' }
    ],
    user: {
      id: req.user.id,
      username: req.user.username
    }
  });
});

app.get('/api/map', authenticateJWT, (req, res) => {
  res.json({ 
    success: true,
    center: [20.5937, 78.9629], // India coordinates
    zoom: 5,
    markers: [
      { id: 1, position: [28.6139, 77.2090], title: 'Delhi' },
      { id: 2, position: [19.0760, 72.8777], title: 'Mumbai' }
    ]
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});