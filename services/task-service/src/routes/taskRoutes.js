const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask } = require('../controllers/taskController');
const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Task routes
router.post('/', authenticateToken, createTask);
router.get('/', authenticateToken, getTasks);
router.get('/:id', authenticateToken, getTask);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;