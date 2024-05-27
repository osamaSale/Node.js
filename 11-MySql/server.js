const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
