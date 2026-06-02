const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');

const app = express();

// Body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging with Morgan
app.use(morgan('dev', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'StarBite API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;