const express = require('express');
const { registerUser, loginUser, searchUser, getUserById, linkUser,uploadUserImage } = require('../controllers/authController');
const router = express.Router();

router.post('/register' ,registerUser);
router.post('/upload' ,uploadUserImage);
router.post('/link', linkUser);
router.post('/login', loginUser);
router.get('/search', searchUser);
router.get('/user', getUserById);

module.exports = router;
