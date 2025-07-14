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

// Request a direct swap
router.post('/request', authenticateToken, [
  body('itemId').notEmpty(),
  body('message').trim().isLength({ min: 10, max: 500 }).optional()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId, message } = req.body;

    // In a real app, you would fetch the item from database
    // For now, we'll simulate with mock data
    const item = {
      id: itemId,
      title: 'Sample Item',
      userId: 'other-user-id',
      status: 'available'
    };

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot request swap for your own item' });
    }

    if (item.status !== 'available') {
      return res.status(400).json({ error: 'Item is not available for swap' });
    }

    const newSwap = {
      id: Date.now().toString(),
      itemId,
      requestorId: req.user.userId,
      ownerId: item.userId,
      type: 'direct_swap',
      status: 'pending',
      message: message || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    swaps.push(newSwap);

    res.status(201).json({
      message: 'Swap request sent successfully',
      swap: newSwap
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ error: 'Failed to create swap request' });
  }
});

// Redeem item with points
router.post('/redeem', authenticateToken, [
  body('itemId').notEmpty()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId } = req.body;

    // In a real app, you would fetch the item from database
    const item = {
      id: itemId,
      title: 'Sample Item',
      userId: 'other-user-id',
      status: 'available',
      points: 150
    };

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot redeem your own item' });
    }

    if (item.status !== 'available') {
      return res.status(400).json({ error: 'Item is not available for redemption' });
    }

    // Check if user has enough points
    const user = users.find(u => u.id === req.user.userId);
    if (!user || user.points < item.points) {
      return res.status(400).json({ error: 'Insufficient points for redemption' });
    }

    // Create redemption swap
    const newSwap = {
      id: Date.now().toString(),
      itemId,
      requestorId: req.user.userId,
      ownerId: item.userId,
      type: 'points_redemption',
      status: 'completed', // Auto-complete point redemptions
      pointsCost: item.points,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    swaps.push(newSwap);

    // Update user points
    user.points -= item.points;

    res.status(201).json({
      message: 'Item redeemed successfully',
      swap: newSwap,
      remainingPoints: user.points
    });
  } catch (error) {
    console.error('Redeem item error:', error);
    res.status(500).json({ error: 'Failed to redeem item' });
  }
});

// Accept swap request
router.put('/:id/accept', authenticateToken, (req, res) => {
  try {
    const swapIndex = swaps.findIndex(s => s.id === req.params.id);
    if (swapIndex === -1) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    const swap = swaps[swapIndex];
    
    // Check if user is the owner of the item
    if (swap.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to accept this swap' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ error: 'Swap is not in pending status' });
    }

    // Update swap status
    swaps[swapIndex].status = 'accepted';
    swaps[swapIndex].updatedAt = new Date().toISOString();

    res.json({
      message: 'Swap request accepted',
      swap: swaps[swapIndex]
    });
  } catch (error) {
    console.error('Accept swap error:', error);
    res.status(500).json({ error: 'Failed to accept swap' });
  }
});

// Reject swap request
router.put('/:id/reject', authenticateToken, (req, res) => {
  try {
    const swapIndex = swaps.findIndex(s => s.id === req.params.id);
    if (swapIndex === -1) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    const swap = swaps[swapIndex];
    
    // Check if user is the owner of the item
    if (swap.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to reject this swap' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ error: 'Swap is not in pending status' });
    }

    // Update swap status
    swaps[swapIndex].status = 'rejected';
    swaps[swapIndex].updatedAt = new Date().toISOString();

    res.json({
      message: 'Swap request rejected',
      swap: swaps[swapIndex]
    });
  } catch (error) {
    console.error('Reject swap error:', error);
    res.status(500).json({ error: 'Failed to reject swap' });
  }
});

// Complete swap (mark as completed)
router.put('/:id/complete', authenticateToken, (req, res) => {
  try {
    const swapIndex = swaps.findIndex(s => s.id === req.params.id);
    if (swapIndex === -1) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    const swap = swaps[swapIndex];
    
    // Check if user is involved in this swap
    if (swap.requestorId !== req.user.userId && swap.ownerId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to complete this swap' });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({ error: 'Swap must be accepted before completion' });
    }

    // Update swap status
    swaps[swapIndex].status = 'completed';
    swaps[swapIndex].completedAt = new Date().toISOString();
    swaps[swapIndex].updatedAt = new Date().toISOString();

    res.json({
      message: 'Swap completed successfully',
      swap: swaps[swapIndex]
    });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({ error: 'Failed to complete swap' });
  }
});

// Cancel swap request
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const swapIndex = swaps.findIndex(s => s.id === req.params.id);
    if (swapIndex === -1) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    const swap = swaps[swapIndex];
    
    // Check if user is the requestor
    if (swap.requestorId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to cancel this swap' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ error: 'Can only cancel pending swaps' });
    }

    swaps.splice(swapIndex, 1);

    res.json({ message: 'Swap request cancelled successfully' });
  } catch (error) {
    console.error('Cancel swap error:', error);
    res.status(500).json({ error: 'Failed to cancel swap' });
  }
});

module.exports = router; 