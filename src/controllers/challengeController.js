const Challenge = require('../models/Challenge');
const logger = require('../utils/logger');
const axios = require('axios');

//Get meal suggestion from TheMealDB based on challenge title
const getMealSuggestion = async (title) => {
  try {
    const baseUrl = process.env.MEALDB_API_URL;

    // Try to search for a meal matching the challenge title
    const searchResponse = await axios.get(
      `${baseUrl}/search.php?s=${encodeURIComponent(title)}`
    );

    if (searchResponse.data.meals && searchResponse.data.meals.length > 0) {
      return searchResponse.data.meals[0].strMeal;
    }

    // If no match found, try searching by the first word of the title
    const firstWord = title.split(' ')[0];
    const fallbackSearch = await axios.get(
      `${baseUrl}/search.php?s=${encodeURIComponent(firstWord)}`
    );

    if (fallbackSearch.data.meals && fallbackSearch.data.meals.length > 0) {
      return fallbackSearch.data.meals[0].strMeal;
    }

    // If still no match, fall back to a random meal
    const randomResponse = await axios.get(`${baseUrl}/random.php`);
    return randomResponse.data.meals[0].strMeal;
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
    const mealSuggestion = await getMealSuggestion(title);

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