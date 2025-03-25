const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

// ✅ CORS Configuration (Allow Frontend + Handle Preflight Requests)
const corsOptions = {
  origin: 'https://mapintegrationmanoj.netlify.app', // Allow only your frontend
  methods: 'GET,POST,PUT,DELETE,OPTIONS', // Include OPTIONS
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(bodyParser.json());

// ✅ Debugging Middleware (Log Requests)
app.use((req, res, next) => {
  console.log(`📥 Incoming Request: ${req.method} ${req.url}`);
  console.log('🔍 Headers:', req.headers);
  next();
});

const SECRET_KEY = 'your_secret_key';
const users = []; // Store users in memory (Replace with a DB in production)

// ✅ Signup API
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save User
  const newUser = { id: users.length + 1, username, password: hashedPassword };
  users.push(newUser);

  console.log(`✅ New user registered: ${username}`);
  res.json({ message: 'User registered successfully' });
});

// ✅ Login API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    console.log(`🔑 User logged in: ${username}`);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ✅ Protected Dashboard API
app.get('/api/dashboard', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'User not logged in' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    console.log(`📊 Dashboard accessed by: ${decoded.username}`);
    res.json({
      cards: [
        { id: 1, title: 'Card 1' },
        { id: 2, title: 'Card 2' },
      ],
    });
  });
});

// ✅ Protected Map API
app.get('/api/map', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'User not logged in' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    console.log(`🗺️ Map accessed by: ${decoded.username}`);
    res.json({
      center: [20.5937, 78.9629], // India coordinates
      zoom: 5,
    });
  });
});

// ✅ Global Middleware to Set CORS Headers for Extra Safety
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://mapintegrationmanoj.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
