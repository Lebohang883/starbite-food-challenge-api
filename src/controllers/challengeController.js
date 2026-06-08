const Challenge = require('../models/Challenge');
const logger = require('../utils/logger');
const axios = require('axios');

//Get meal suggestion from TheMealDB
const getMealSuggestion = async () => {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
    return response.data.meals[0].strMeal;
  } catch (error) {
    logger.error(`MealDB API error: ${error.message}`);
    return null;
  }
};

//Get all challenges
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate('createdBy', 'username email');
    logger.info('Fetched all challenges');
    res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    logger.error(`Get challenges error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

//Create challenge
const createChallenge = async (req, res) => {
  try {
    const { title, description, points, deadline } = req.body;

    // Get meal suggestion from TheMealDB
    const mealSuggestion = await getMealSuggestion();

    const challenge = await Challenge.create({
      title,
      description,
      points,
      deadline,
      createdBy: req.user._id,
      mealSuggestion
    });

    logger.info(`Challenge created: ${title}`);
    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    logger.error(`Create challenge error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

//Update challenge
const updateChallenge = async (req, res) => {
  try {
    const { title, description, points, deadline } = req.body;
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { title, description, points, deadline },
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    logger.info(`Challenge updated: ${challenge.title}`);
    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    logger.error(`Update challenge error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

//Delete challenge
const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    logger.info(`Challenge deleted: ${challenge.title}`);
    res.status(200).json({ success: true, message: 'Challenge deleted successfully' });
  } catch (error) {
    logger.error(`Delete challenge error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllChallenges, createChallenge, updateChallenge, deleteChallenge };