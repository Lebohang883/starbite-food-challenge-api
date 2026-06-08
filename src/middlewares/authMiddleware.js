const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization.startsWith('Bearer')) {
          token = req.headers.authorization.split(' ')[1];  
        }

        if(!token) {
            return res.status(401).json({ error: 'Not authorized, no token provided' });
        }

        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Attach user to request
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }

        logger.info('Authenticated user: ${req.user.email}');
        next();
    } catch (error) {
        logger.error('Auth middleware error: ${error.message}');
        res.status(401).json({ error: 'Not authorized, invalid token' });
    }
};

//Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin'){
        next();
    }else {
        res.status(403).json({ error: 'Access denied, admin only' });
    }
};

module.exports = {protect, adminOnly};