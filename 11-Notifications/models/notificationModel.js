// backend/models/notificationModel.js
const db = require('../config/db');

const Notification = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM notifications');
    return rows;
  },
  create: async (title, message) => {
    const [result] = await db.query('INSERT INTO notifications (title, message) VALUES (?, ?)', [title, message]);
    return { id: result.insertId, title, message };
  }
};

module.exports = Notification;
