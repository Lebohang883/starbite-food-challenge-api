const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validationMiddleware');

//POST/ auth/register
router.post('/register', validateRegister, registerUser);

//POST/ auth/login
router.post('/login',validateLogin, loginUser);

module.exports = router;