const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const MOCK_USER = {
  id: 'mock-user-123',
  userId: 'mock-user-123',
  name: 'Demo User',
  email: 'user123@gmail.com',
  role: 'user',
  points: 100
};

router.post('/register', async (req, res) => {
  res.status(403).json({ error: 'Registration is disabled in read-only mode' });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === 'user123@gmail.com' && password === 'User@123') {
      const token = jwt.sign(
        { userId: MOCK_USER.id, role: 'user' }, 
        process.env.JWT_SECRET || 'your-secret-key', 
        { expiresIn: '24h' }
      );
      return res.json({ message: 'Login successful', token, user: MOCK_USER });
    }
    return res.status(401).json({ error: 'Login failed: Invalid credentials' });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', message: err.message });
  }
});

router.get('/profile', (req, res) => {
  res.json(MOCK_USER);
});

module.exports = router; 