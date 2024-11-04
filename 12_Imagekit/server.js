// server.js
const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const db = require('./config/db');
const imagekit = require('./config/imagekit');
const jwt = require('jsonwebtoken'); 
const app = express();

app.use(express.json());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Read: Add a new user with an image upload
app.get('/users',async (req,res)=>{
  const sql ="select * from users"
  db.query(sql,(err ,result)=>{
    res.json(result)
  })
})

// CREATE: Add a new user with an image upload
app.post('/users', upload.single('image'), async (req, res) => {
  const { name, email, password, phone } = req.body;
  const file = req.file;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Upload image to ImageKit
    const uploadResponse = await imagekit.upload({
      file: file.buffer.toString('base64'),
      fileName: file.originalname,
      folder: "/ImageKit/users",
    });

    // Save user data to MySQL
    const sql = `INSERT INTO users (name, email, password, image, phone, file_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [name, email, hashedPassword, uploadResponse.url, phone, uploadResponse.fileId];

    db.query(sql, values, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Database error" });
        return;
      }
      res.status(201).json({ message: "User created successfully", userId: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: "Error uploading image" });
  }
});

// DELETE: Delete a user and their image
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  // Find user’s image file ID from the database
  db.query('SELECT file_id FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const fileId = result[0].file_id;

    // Delete image from ImageKit
    imagekit.deleteFile(fileId, (error) => {
      if (error) {
        res.status(500).json({ error: "Error deleting image" });
        return;
      }

      // Delete user record from the database
      db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
          res.status(500).json({ error: "Database error" });
          return;
        }
        res.status(200).json({ message: "User and image deleted successfully" });
      });
    });
  });
});

// UPDATE: Update a user’s information and image
app.put('/users/:id', upload.single('image'), async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, phone } = req.body;
  const file = req.file;

  try {
    // Fetch the existing user data to get the old file ID
    db.query('SELECT file_id, image FROM users WHERE id = ?', [userId], async (err, result) => {
      if (err) {
        res.status(500).json({ error: "Database error" });
        return;
      }

      if (result.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const existingFileId = result[0].file_id;
      let updatedFileId = existingFileId;
      let updatedImageUrl = result[0].image;

      // If a new image file is uploaded, replace the existing image in ImageKit
      if (file) {
        // Delete the old image from ImageKit
        await imagekit.deleteFile(existingFileId);

        // Upload the new image to ImageKit
        const uploadResponse = await imagekit.upload({
          file: file.buffer.toString('base64'),
          fileName: file.originalname,
          folder: "/ImageKit/users",
        });

        updatedFileId = uploadResponse.fileId;
        updatedImageUrl = uploadResponse.url;
      }

      // Hash the password if it’s being updated
      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

      // Update user data in the database
      const sql = `
        UPDATE users
        SET name = ?, email = ?, ${password ? 'password = ?,' : ''} phone = ?, image = ?, file_id = ?
        WHERE id = ?
      `;

      const values = [name, email, ...(password ? [hashedPassword] : []), phone, updatedImageUrl, updatedFileId, userId];

      db.query(sql, values, (err) => {
        if (err) {
          res.status(500).json({ error: "Database error" });
          return;
        }
        res.status(200).json({ message: "User updated successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
});

// LOGIN: Authenticate user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const sql = `select * from users where email ='${email}' `;
  // Find user by email
  db.query(sql, async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {

      console.log(email)
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];

    // Compare the password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token (optional)
    const token = jwt.sign({ userId: user.id, email: user.email } , "jwtSecret", { expiresIn: process.env.TOKEN_EXPIRATION });

    // Respond with success and token (if using JWT)
    res.status(200).json({
      message: "Login successful",
      token, // only if using JWT
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
