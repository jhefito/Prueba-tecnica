require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

const jwt = require('jsonwebtoken');
const taskRoutes = require('./routes/taskRoutes');

// Routes
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Task Service API' });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Task service running on port ${PORT}`);
});