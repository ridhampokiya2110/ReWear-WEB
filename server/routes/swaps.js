const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// In-memory storage for swaps and users (in production, use a database)
let swaps = [];
let users = [
  {
    id: '1',
    email: 'admin@rewear.com',
    name: 'Admin User',
    role: 'admin',
    points: 1000
  }
];

// Get all swaps for a user
router.get('/me', authenticateToken, (req, res) => {
  try {
    const userSwaps = swaps.filter(swap => 
      swap.requestorId === req.user.userId || swap.ownerId === req.user.userId
    );
    
    res.json(userSwaps);
  } catch (error) {
    console.error('Get user swaps error:', error);
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
});

// Get swap by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const swap = swaps.find(s => s.id === req.params.id);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }
    
    // Check if user is involved in this swap
    if (swap.requestorId !== req.user.userId && swap.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to view this swap' });
    }
    
    res.json(swap);
  } catch (error) {
    console.error('Get swap error:', error);
    res.status(500).json({ error: 'Failed to fetch swap' });
  }
});



module.exports = router; 