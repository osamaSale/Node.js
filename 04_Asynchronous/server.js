//There are three main ways in Node to handel asynchronous code

// callbacks, promises and async/await

const express = require("express");
const app = express();

// callbacks

const fs = require("fs"); // Node File System

// used to: read, write, update, delete

// read
fs.readFile("txt.txt", (err, data) => {
  if (err) throw err;
  // console.log(data.toString());
});

// write
fs.writeFile("txt.txt", "Hello World osama", (err) => {
  if (err) throw err;
  // console.log("The file has been saved");
});

// update
fs.appendFile("txt.txt", " This is my text.", function (err) {
  if (err) throw err;
  // console.log("Updated!");
});

// delete

//fs.unlink("txt.txt", function (err) {
// if (err) throw err;
//  console.log("File deleted!");
//});

// Promises

// External APIs

// using an NPM package called axios to send requests to other servers

const axios = require("axios");

axios
  .get("https://jsonplaceholder.typicode.com/posts/1")
  // in `.then()` we add the code for the success
  .then((response) => {
    // console.log(response.data);
  })
  // in `.catch()` we add the code to handel the error
  .catch((err) => {
    throw err;
  });

// Async And Await

const getAllPosts = async () => {
  // using try/catch for error handling
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts/2");
    //console.log(response.data);
  } catch (err) {
    throw err;
  }
};


const promiseFs = require("fs").promises;

const readFile = async () => {
  try {
    const data = await promiseFs.readFile("txt.txt");
    console.log(data.toString());
  } catch (err) {
    throw err;
  }
};

readFile();
getAllPosts();


const port = 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// Async And Await
