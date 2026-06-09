const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const challengeRoutes = require('./routes/challengeRoutes');

const app = express();

// Body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging with Morgan
app.use(morgan('dev', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/challenges', challengeRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'StarBite API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;