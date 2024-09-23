// backend/models/notificationModel.js
const db = require('../config/db');

const Notification = {
  getAll: async (userId) => {
    const [rows] = await db.query('SELECT * FROM notifications WHERE user_id = ?', [userId]);
    return rows;
  },
  create: async (userId, title, message) => {
    const [result] = await db.query('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)', [userId, title, message]);
    return { id: result.insertId, userId, title, message };
  }
};

module.exports = Notification;
