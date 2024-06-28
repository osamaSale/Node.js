// backend/controllers/notificationController.js
const Notification = require('../models/notificationModel');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getAll();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createNotification = async (req, res, io) => {
  const { title, message } = req.body;
  try {
    const newNotification = await Notification.create(title, message);
    io.emit('new-notification', newNotification);
    res.json(newNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getNotifications,
  createNotification
};
