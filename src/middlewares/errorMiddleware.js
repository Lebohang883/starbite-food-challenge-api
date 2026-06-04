const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    //Mongoose bad ObjectId error
    if (err.name === 'CastError') {
        statusCode = 404;
        message = 'Resource not found';
    }

    //Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = `${Object.keys(err.keyValue)} already exists`;
    }

    //Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message).join(', ');
    }

    //JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method}`);

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

module.exports = errorHandler;
