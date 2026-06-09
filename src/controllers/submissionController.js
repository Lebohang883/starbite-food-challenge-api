const Submission = require('../models/Submission');
const User = require('../models/User');
const logger = require('../utils/logger');

// Submit a challenge
const createSubmission = async (req, res) => {
  try {
    const { challengeId, notes } = req.body;

    const submission = await Submission.create({
      userId: req.user._id,
      challengeId,
      notes
    });

    logger.info(`Submission created by user: ${req.user.email}`);
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    logger.error(`Create submission error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all submissions
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('userId', 'username email')
      .populate('challengeId', 'title points');

    logger.info('Fetched all submissions');
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    logger.error(`Get submissions error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

//  Approve or reject submission
const updateSubmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'username email')
     .populate('challengeId', 'title points');

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // If approved, add points to user
    if (status === 'approved') {
      await User.findByIdAndUpdate(submission.userId._id, {
        $inc: { points: submission.challengeId.points }
      });
      logger.info(`Submission approved, points added to user: ${submission.userId.email}`);
    }

    logger.info(`Submission status updated to: ${status}`);
    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    logger.error(`Update submission error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createSubmission, getAllSubmissions, updateSubmissionStatus };