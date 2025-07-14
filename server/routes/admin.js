const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Middleware to verify JWT token and admin role
const authenticateAdmin = (req, res, next) => {
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
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.user = user;
    next();
  });
};

// In-memory storage (in production, use a database)
let items = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket in excellent condition.',
    category: 'Outerwear',
    type: 'Jacket',
    size: 'M',
    condition: 'Excellent',
    tags: ['vintage', 'denim', 'casual'],
    images: ['/uploads/sample-jacket-1.jpg'],
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

let users = [
  {
    id: '1',
    email: 'admin@rewear.com',
    name: 'Admin User',
    role: 'admin',
    points: 1000,
    createdAt: new Date().toISOString()
  }
];

// Get all pending items for moderation
router.get('/pending-items', authenticateAdmin, (req, res) => {
  try {
    const pendingItems = items.filter(item => !item.approved);
    res.json(pendingItems);
  } catch (error) {
    console.error('Get pending items error:', error);
    res.status(500).json({ error: 'Failed to fetch pending items' });
  }
});

// Get all items (admin view)
router.get('/items', authenticateAdmin, (req, res) => {
  try {
    const { status, approved } = req.query;
    
    let filteredItems = items;

    if (status) {
      filteredItems = filteredItems.filter(item => item.status === status);
    }
    
    if (approved !== undefined) {
      filteredItems = filteredItems.filter(item => item.approved === (approved === 'true'));
    }

    res.json(filteredItems);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get all users (admin view)
router.get('/users', authenticateAdmin, (req, res) => {
  try {
    const userList = users.map(user => ({
      _id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      status: 'active',
      createdAt: user.createdAt
    }));
    
    res.json(userList);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Ban/Activate user
router.put('/users/:id/:action', authenticateAdmin, (req, res) => {
  try {
    const { id, action } = req.params;
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (action === 'ban') {
      users[userIndex].status = 'banned';
    } else if (action === 'activate') {
      users[userIndex].status = 'active';
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    res.json({
      message: `User ${action} successfully`,
      user: users[userIndex]
    });
  } catch (error) {
    console.error('User action error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Approve item
router.put('/items/:id/approve', authenticateAdmin, (req, res) => {
  try {
    const itemIndex = items.findIndex(item => item.id === req.params.id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    items[itemIndex].approved = true;
    items[itemIndex].approvedAt = new Date().toISOString();

    res.json({
      message: 'Item approved successfully',
      item: items[itemIndex]
    });
  } catch (error) {
    console.error('Approve item error:', error);
    res.status(500).json({ error: 'Failed to approve item' });
  }
});

// Reject item
router.put('/items/:id/reject', authenticateAdmin, [
  body('reason').trim().isLength({ min: 5, max: 200 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const itemIndex = items.findIndex(item => item.id === req.params.id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const { reason } = req.body;

    items[itemIndex].approved = false;
    items[itemIndex].rejectedAt = new Date().toISOString();
    items[itemIndex].rejectionReason = reason;

    res.json({
      message: 'Item rejected successfully',
      item: items[itemIndex]
    });
  } catch (error) {
    console.error('Reject item error:', error);
    res.status(500).json({ error: 'Failed to reject item' });
  }
});

// Remove item (admin delete)
router.delete('/items/:id', authenticateAdmin, (req, res) => {
  try {
    const itemIndex = items.findIndex(item => item.id === req.params.id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const removedItem = items.splice(itemIndex, 1)[0];

    res.json({
      message: 'Item removed successfully',
      removedItem
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Get all swaps (admin view)
router.get('/swaps', authenticateAdmin, (req, res) => {
  try {
    // This would typically come from a swaps collection
    // For now, returning empty array as swaps are handled in swaps.js
    res.json([]);
  } catch (error) {
    console.error('Get swaps error:', error);
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
});

// Approve/Reject swap
router.put('/swaps/:id/:action', authenticateAdmin, (req, res) => {
  try {
    const { id, action } = req.params;
    
    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // This would typically update a swap in the database
    res.json({
      message: `Swap ${action} successfully`
    });
  } catch (error) {
    console.error('Swap action error:', error);
    res.status(500).json({ error: 'Failed to update swap status' });
  }
});

// Update user points (admin)
router.put('/users/:id/points', authenticateAdmin, [
  body('points').isInt({ min: 0 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userIndex = users.findIndex(user => user.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { points } = req.body;
    users[userIndex].points = parseInt(points);

    res.json({
      message: 'User points updated successfully',
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        name: users[userIndex].name,
        role: users[userIndex].role,
        points: users[userIndex].points
      }
    });
  } catch (error) {
    console.error('Update user points error:', error);
    res.status(500).json({ error: 'Failed to update user points' });
  }
});

// Get platform statistics
router.get('/stats', authenticateAdmin, (req, res) => {
  try {
    const stats = {
      totalUsers: users.length,
      totalItems: items.length,
      totalSwaps: 0, // Would come from swaps collection
      pendingSwaps: 0, // Would come from swaps collection
      approvedItems: items.filter(item => item.approved).length,
      pendingItems: items.filter(item => !item.approved).length,
      availableItems: items.filter(item => item.status === 'available' && item.approved).length,
      totalPoints: users.reduce((sum, user) => sum + user.points, 0),
      averagePointsPerUser: users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.points, 0) / users.length) : 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get recent activity
router.get('/activity', authenticateAdmin, (req, res) => {
  try {
    const recentItems = items
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(item => ({
        id: item.id,
        title: item.title,
        action: item.approved ? 'approved' : 'pending',
        createdAt: item.createdAt,
        userId: item.userId
      }));

    res.json(recentItems);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

module.exports = router; 