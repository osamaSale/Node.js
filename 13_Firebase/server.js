// app.js
const admin = require('firebase-admin');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK with your service account
admin.initializeApp({
  credential: admin.credential.cert(require('./config/firebase-key.json'))
});
app.use(bodyParser.json());
const db = admin.firestore();



app.get('/users', async (req, res) => {
    try {
      const usersSnapshot = await db.collection('osama').get();
      const usersList = [];
      usersSnapshot.forEach(doc => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(usersList);
    } catch (error) {
      res.status(500).send('Error fetching users: ' + error.message);
    }
  });
// POST route to add a new user document
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
      const userRef = db.collection('osama').doc();  // Generate a new document ID
      await userRef.set({
        name,
        email
      });
      res.status(200).send('User added successfully!');
    } catch (error) {
      res.status(500).send('Error adding user: ' + error.message);
    }
  });

// GET route to fetch a single user by ID
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      const userDoc = await db.collection('osama').doc(userId).get();
      if (userDoc.exists) {
        res.status(200).json({ id: userDoc.id, ...userDoc.data() });
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      res.status(500).send('Error fetching user: ' + error.message);
    }
  });



  // PUT route to update user information
app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    try {
      const userRef = db.collection('osama').doc(userId);
      await userRef.update({
        name,
        email
      });
      res.status(200).send('User updated successfully!');
    } catch (error) {
      res.status(500).send('Error updating user: ' + error.message);
    }
  });
  // DELETE route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      await db.collection('osama').doc(userId).delete();
      res.status(200).send('User deleted successfully!');
    } catch (error) {
      res.status(500).send('Error deleting user: ' + error.message);
    }
  });



  // Login route
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const idToken = await userCredential.user.getIdToken();
      res.status(200).json({ message: 'Login successful!', idToken });
    } catch (error) {
      res.status(401).send(`Error logging in: ${error.message}`);
    }
  });
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
