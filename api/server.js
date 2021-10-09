const express = require('express');
const morgan = require('morgan');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 2021;

const restaurantsRoute = require('./routes/restaurants.js');

// Show HTTP logs
app.use(morgan('dev'));

// Receive json body from client
app.use(express.json());

app.get('/', (req, res) => {
	res.json('Hi there!');
});

app.use('/api/v1/restaurants', restaurantsRoute);

app.listen(port, () => {
	console.log(`Server is up and running on port ${port}`);
});
