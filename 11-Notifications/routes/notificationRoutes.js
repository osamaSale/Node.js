// backend/routes/notificationRoutes.js
const express = require('express');
const { getNotifications, createNotification } = require('../controllers/notificationController');
const router = express.Router();

router.get('/', getNotifications);
router.post('/', (req, res) => createNotification(req, res, req.app.get('io')));

module.exports = router;

