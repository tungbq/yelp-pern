const express = require('express');
const morgan = require('morgan');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 2021;
const db = require('./db');

// Show HTTP logs
app.use(morgan('dev'));

// Receive json body from client
app.use(express.json());

app.get('/', (req, res) => {
	res.json('Hi there!');
});

// Get all restaurants
app.get('/api/v1/restaurants', async (req, res) => {
	const results = await db.query('SELECT * FROM restaurants');
	console.log(results);

	res.status(200).json({
		status: 'success',
		data: results.rows,
	});
});

// Get restaurant by ID
app.get('/api/v1/restaurants/:id', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			restaurants: ['1'],
		},
	});
});

// Create restaurant
app.post('/api/v1/restaurants', (req, res) => {
	res.status(200).json(req.body);
});

// Update restaurant
app.put('/api/v1/restaurants/:id', (req, res) => {
	res.status(200).json(req.params.id);
});

// Delete restaurant
app.delete('/api/v1/restaurants/:id', (req, res) => {
	res.status(204).json(req.params.id);
});

app.listen(port, () => {
	console.log(`Server is up and running on port ${port}`);
});
