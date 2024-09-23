// backend/routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser , getOnlineUsers} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/online', getOnlineUsers);
module.exports = router;
