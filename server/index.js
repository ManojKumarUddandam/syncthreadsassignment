const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port

// ✅ Enhanced CORS Configuration
const allowedOrigins = [
  'https://mapintegrationmanoj.netlify.app',
  'http://localhost:3000' // For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle all OPTIONS requests

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Enhanced Debugging Middleware
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('🔍 Headers:', req.headers);
  console.log('📦 Body:', req.body);
  next();
});

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_should_be_long_and_complex';
const users = []; // In-memory storage (replace with database in production)

// ✅ Improved Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ✅ Enhanced Signup API
app.post('/api/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user exists
    const userExists = users.some(u => u.username === username);
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save User
    const newUser = { 
      id: users.length + 1, 
      username, 
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);

    console.log(`✅ New user registered: ${username}`);
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username }
    });
  } catch (err) {
    next(err);
  }
});

// ✅ Enhanced Login API
app.post('/api/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    console.log(`🔑 User logged in: ${username}`);
    res.json({ 
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    next(err);
  }
});

// ✅ Protected Routes Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// ✅ Protected Dashboard API
app.get('/api/dashboard', authenticateJWT, (req, res) => {
  console.log(`📊 Dashboard accessed by: ${req.user.username}`);
  res.json({
    cards: [
      { id: 1, title: 'Card 1', content: 'Dashboard content 1' },
      { id: 2, title: 'Card 2', content: 'Dashboard content 2' },
    ],
    user: {
      id: req.user.id,
      username: req.user.username
    }
  });
});

// ✅ Protected Map API
app.get('/api/map', authenticateJWT, (req, res) => {
  console.log(`🗺️ Map accessed by: ${req.user.username}`);
  res.json({
    center: [20.5937, 78.9629], // India coordinates
    zoom: 5,
    markers: [
      { id: 1, position: [28.6139, 77.2090], title: 'Delhi' },
      { id: 2, position: [19.0760, 72.8777], title: 'Mumbai' }
    ]
  });
});

// ✅ Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
});