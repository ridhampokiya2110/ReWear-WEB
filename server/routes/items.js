const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

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

// In-memory items storage (in production, use a database)
let items = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket in excellent condition. Perfect for layering.',
    category: 'Outerwear',
    type: 'Jacket',
    size: 'M',
    condition: 'Excellent',
    tags: ['vintage', 'denim', 'casual'],
    images: ['/dekstop/denim.jpg'],
    userId: '1',
    status: 'available',
    points: 150,
    createdAt: new Date().toISOString(),
    approved: true
  },
  {
    id: '2',
    title: 'Summer Floral Dress',
    description: 'Light and breezy floral dress perfect for warm weather.',
    category: 'Dresses',
    type: 'Dress',
    size: 'S',
    condition: 'Good',
    tags: ['summer', 'floral', 'casual'],
    images: ['/uploads/sample-dress-1.jpg'],
    userId: '1',
    status: 'available',
    points: 120,
    createdAt: new Date().toISOString(),
    approved: true
  }
];

// Get all items (with optional filtering)
router.get('/', (req, res) => {
  try {
    const { category, size, condition, search, status = 'available' } = req.query;
    
    let filteredItems = items.filter(item => item.status === status && item.approved);

    // Apply filters
    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }
    if (size) {
      filteredItems = filteredItems.filter(item => item.size === size);
    }
    if (condition) {
      filteredItems = filteredItems.filter(item => item.condition === condition);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    res.json(filteredItems);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get featured items (for carousel)
router.get('/featured', (req, res) => {
  try {
    const featuredItems = items
      .filter(item => item.status === 'available' && item.approved)
      .slice(0, 6); // Limit to 6 featured items
    
    res.json(featuredItems);
  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({ error: 'Failed to fetch featured items' });
  }
});

// Get single item by ID
router.get('/:id', (req, res) => {
  try {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});



// Get user's items
router.get('/user/me', authenticateToken, (req, res) => {
  try {
    const userItems = items.filter(item => item.userId === req.user.userId);
    res.json(userItems);
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ error: 'Failed to fetch user items' });
  }
});

module.exports = router; 