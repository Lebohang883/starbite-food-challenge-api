const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');
const { protect } = require('../middlewares/authMiddleware');

// GET/ leaderboard
router.get('/', protect, getLeaderboard);

module.exports = router;