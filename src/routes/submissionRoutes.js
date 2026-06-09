const express = require('express');
const router = express.Router();
const { createSubmission, getAllSubmissions, updateSubmissionStatus} = require('../controllers/submissionController');
const { protect } = require('../middlewares/authMiddleware');

//POST/submissions
router.post('/', protect, createSubmission);

// GET/submissions
router.get('/', protect, getAllSubmissions);

// PATCH/submissions/:id/approve
router.patch('/:id/approve', protect, updateSubmissionStatus);

module.exports = router;