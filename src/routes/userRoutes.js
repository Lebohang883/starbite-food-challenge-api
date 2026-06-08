const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

//GET /users
router.get('/', protect, getAllUsers);

//GET /users/:id
router.get('/:id', protect, getUserById);

// PUT /users/:id
router.put('/:id', protect, updateUser);

//DELETE /users/:id
router.delete('/:id', protect, deleteUser);

module.exports = router;