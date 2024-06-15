const express = require('express');
const { registerUser, loginUser, searchUser, getUserById } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/search', searchUser);
router.get('/user', getUserById);

module.exports = router;
