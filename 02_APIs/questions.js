const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

const users = [
  { id: 1, name: "John", age: "10" },
  { id: 2, name: "Jane", age: "9" },
  { id: 3, name: "Mark", age: "8" },
];
// 1 Using the example code above run the server and make a GET request using Postman to retrieve the users count.
app.get("/get/user", (req, res) => {
  res.json(users.length);
});
// 2 Using Postman make a post request to create a new user, make sure to open the body tab to send raw JSON data(The data must be in JSON format).
app.post("/create/user", (req, res) => {
  const newuser = req.body;
  users.push(newuser);
  res.json(users);
});
// 3 Create a new endpoint first-user that would return the first user in the array and test it out using Postman.
app.put("/first/user/:id", (req, res) => {
  res.json(users[req.params.id]);
  //res.json(users[0])
});
// 4 Create a new endpoint create/users that would add multiple users to the users array and then send back a response of all the new users that have been added.
app.post("/create/user", (req, res) => {
  const newuser = req.body;
  users.push(newuser);
  res.json(users);
});
// 5 Create a new endpoint / with the method of GET, return a response of hello world and open the following link http://localhost:3000/ and explain what happens when you open the API endpoint in the browser.
app.get("/", (req, res) => {
  res.json("hello world");
});
//Practice
// 1 Search the express documentation on how to create a PUT request and create two new API endpoints in the server to handel updating a username (changing the name of one of the users).
app.put("/update/user/:id", (req, res) => {
  users[req.params.id].name = req.body.name;
  res.json(users[req.params.id]);
});
// 2 Search on how to send query parameters (preferably using the URL) with GET requests using Postman, and create a new API endpoint get-user, send a user through the query parameters and then in the server check if the user exist in the array and if not then return a status of 404 and a message of Not Found and if the user is found return the same user (search on how to access the query parameters from the request parameter).
app.put("/Get/users/:id/:name", (req, res) => {
  res.status(404);
  users[req.params.id].name = req.params.name;
  res.json(users[req.params.id]);
});
// 3 Search on how create a DELETE request and create a new API endpoint in the server to handel deleting a specific user from the array(DELETE requests send data through query parameters).
app.delete("/delete/:id", (req, res) => {
  user = users.filter((e) => {
    return e.id != req.params.id;
  });
  res.json(user);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
