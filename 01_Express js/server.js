// require express
const express = require("express");
// instantiate express
const app = express();
const port = 5000;



// Hello world example
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// run the server locally on the desired port, use the following link to open up the server http://localhost:3000`
app.listen(port, () => {
  // will log to the command line when the server starts
  console.log(`Example app listening at http://localhost:${port}`);
});