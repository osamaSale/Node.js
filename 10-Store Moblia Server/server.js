const express = require("express");
const cors = require("cors");
const app = express();
require("./connection/mysql");
const router = require("./router/router");
require("dotenv").config();



app.use(express.json());
app.use(cors());
app.use(router);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });

  