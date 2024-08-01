const express = require('express');
const { registerUser, loginUser, searchUser, getUserById, linkUser,uploadUserImage, getLinkedUsers, unlinkUser} = require('../controllers/authController');
const router = express.Router();

router.post('/register' ,registerUser);
router.post('/upload' ,uploadUserImage);
router.post('/link', linkUser);
router.post('/unlink', unlinkUser);
router.post('/login', loginUser);
router.get('/search', searchUser);
router.get('/user', getUserById);
router.get('/linked_users', getLinkedUsers)

module.exports = router;
