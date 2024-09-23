// backend/controllers/userController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Correct import of bcryptjs

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create(username, password);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token , user});
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const token = authHeader?.replace('Bearer ', ''); 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const getOnlineUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT username FROM users WHERE online = false');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch online users' });
  }
}
module.exports = {
  registerUser,
  loginUser,
  authenticate,
  getOnlineUsers
};
