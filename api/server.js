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
	try {
		const results = await db.query('SELECT * FROM restaurants');

		res.status(200).json({
			status: 'success',
			result: results.rows.length,
			data: {
				restaurants: results.rows,
			},
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get restaurant by ID
app.get('/api/v1/restaurants/:id', async (req, res) => {
	try {
		// Parameterized query to avoid sql injection vulnerabilities
		const result = await db.query(`SELECT * FROM restaurants WHERE id= $1`, [
			req.params.id,
		]);

		res.status(200).json({
			status: 'success',
			data: {
				restaurants: result.rows[0],
			},
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

// Create restaurant
app.post('/api/v1/restaurants', async (req, res) => {
	try {
		const addedRestaurants = await db.query(
			`INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) returning *`,
			[req.body.name, req.body.location, req.body.price_range]
		);

		res.status(200).json({
			status: 'success',
			data: {
				restaurants: addedRestaurants.rows[0],
			},
		});	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
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
