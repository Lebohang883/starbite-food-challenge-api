const User = require('../models/User');
const logger = require('../utils/logger');

//Get leaderboard
const getLeaderboard = async (req, res) => {
try {
    const leaderboard = await User.find()
    .select('username email points role')
    .sort({ points: -1 })
    .limit(10);

    logger.info('Fetched leaderboard');
    res.status(200).json({
        success: true,
        data: leaderboard.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            email: user.email,
            points: user.points,
            role: user.role
        }))
    });
 } catch (error) {
    logger.error(`Leaderboard error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
 }
};

module.exports = { getLeaderboard};