
const admin = require('firebase-admin');
require('dotenv').config();
const firebaseConfig = {
  apiKey: "AIzaSyCfHkSVm-BIMiHW_0bI61Ljm5uVCWwcWP4",
  authDomain: "osama-d1388.firebaseapp.com",
  projectId: "osama-d1388",
  storageBucket: "osama-d1388.firebasestorage.app",
  messagingSenderId: "536903396121",
  appId: "1:536903396121:web:5d5219445fbb5bfa03b388",
  measurementId: "G-KF4C7QSL72"
};

// Load the service account key JSON file
const serviceAccount = require(firebaseConfig);

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Optional: Set the database URL if you’re using Firebase Realtime Database
   databaseURL: "https://osama-d1388.firebaseio.com"
});


// Initialize Firestore
const db = admin.firestore();

// Example: Add a document to test Firestore connection
async function testFirestore() {
  try {
    const docRef = db.collection('testCollection').doc('testDoc');
    await docRef.set({
      exampleField: 'Hello, Firebase!'
    });
    console.log('Document written successfully');
  } catch (error) {
    console.error('Error writing document:', error);
  }
}

// Run the test function
testFirestore();
