const express = require('express');
const router = express.Router();
const { getAllChallenges, createChallenge, updateChallenge, deleteChallenge } = require('../controllers/challengeController');
const { protect } = require('../middlewares/authMiddleware');

//GET /challenges
router.get('/', protect, getAllChallenges);

//POST /challenges
router.post('/', protect, createChallenge);

//PUT /challenges/:id
router.put('/:id', protect, updateChallenge);

//DELETE /challenges/:id
router.delete('/:id', protect, deleteChallenge);

module.exports = router;