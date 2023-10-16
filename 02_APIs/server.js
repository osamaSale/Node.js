console.log("Application Programming Interface");
/*
RESTful APIs

GET: it is used to retrieve data from a specified resource like a server
POST: it is used to submit data to the specified resource
PUT: it is used to update data from the specified resource
DELETE: it is used to delete data from the specified resource
*/

const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

const users = ["John", "Jane", "Mark"];

app.get("/users-count", (req, res) => {
  res.status(200);
  res.json(users);
});

app.post("/create/user", (req, res) => {
  const user = req.body.name;
  users.push(user);
  res.status(201);
  res.json(user);
});

app.delete("/delete", function (req, res) {
  users.pop();
  res.send("DELETE request to homepage");
});

app.put("/update/:name", function (req, res) {
  users[0] = "osama";
  res.send("PUT request to homepage");
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
