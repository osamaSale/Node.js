// backend/controllers/notificationController.js
const Notification = require('../models/notificationModel');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getAll(req.userId);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createNotification = async (req, res, io) => {
  const { title, message } = req.body;
  try {
    const newNotification = await Notification.create(req.userId, title, message);
    io.emit('new-notification', newNotification , 'user' , req.user);
    res.json(newNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getNotifications,
  createNotification,

};
