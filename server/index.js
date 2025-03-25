const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'https://mapintegrationmanoj.netlify.app', // Allow only your frontend domain
  methods: 'GET,POST,PUT,DELETE',
  credentials: true // Allow cookies and authorization headers
}));
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';
const users = []; // Store users in memory (replace with a database in production)

// Signup API
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user
  const newUser = { id: users.length + 1, username, password: hashedPassword };
  users.push(newUser);

  res.json({ message: 'User registered successfully' });
});

// Login API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected Dashboard API
app.get('/api/dashboard', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'User not logged in' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    res.json({
      cards: [
        { id: 1, title: 'Card 1' },
        { id: 2, title: 'Card 2' },
      ],
    });
  });
});

// Protected Map API
app.get('/api/map', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'User not logged in' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    res.json({
      center: [20.5937, 78.9629], // India coordinates
      zoom: 5,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});