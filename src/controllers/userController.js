const User = require('../models/User');
const logger = require('../utils/logger');

// Get all users
// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    logger.info('Fetched all users');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    logger.error(`Get all users error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single user
//  GET /users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    logger.info(`Fetched user: ${user.email}`);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error(`Get user error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

//  Update user
//  PUT /users/:id
const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info(`Updated user: ${user.email}`);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error(`Update user error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

//   Delete user
//   DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    logger.info(`Deleted user: ${user.email}`);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    logger.error(`Delete user error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };