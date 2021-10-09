const router = require('express').Router();
const db = require('../db');

// Get all restaurants
router.get('/', async (req, res) => {
	try {
		const restaurantRatingsData = await db.query(
			'SELECT * FROM restaurants LEFT JOIN (SELECT restaurants_id, COUNT(*), TRUNC(AVG(rating), 1) AS avarage_rating FROM reviews GROUP BY restaurants_id) reviews ON restaurants.id = reviews.restaurants_id;'
		);

		res.status(200).json({
			status: 'success',
			result: restaurantRatingsData.rows.length,
			data: {
				restaurants: restaurantRatingsData.rows,
			},
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
	try {
		// Parameterized query to avoid sql injection vulnerabilities
		const restaurant = await db.query(
			`SELECT * FROM restaurants LEFT JOIN (SELECT restaurants_id, COUNT(*), TRUNC(AVG(rating), 1) AS avarage_rating FROM reviews GROUP BY restaurants_id) reviews ON restaurants.id = reviews.restaurants_id WHERE id = $1`,
			[req.params.id]
		);

		const reviews = await db.query(`SELECT * FROM reviews WHERE restaurants_id= $1`, [
			req.params.id,
		]);

		res.status(200).json({
			status: 'success',
			data: {
				restaurants: restaurant.rows[0],
				reviews: reviews.rows,
			},
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

// Create restaurant
router.post('/', async (req, res) => {
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
		});
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

// Update restaurant
router.put('/:id', async (req, res) => {
	// Sample cmd: UPDATE restaurants SET name = 'test-updated', location = 'test-updated-2', price_range = 2 WHERE id = 8;
	try {
		const updatedRestaurant = await db.query(
			`UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *`,
			[req.body.name, req.body.location, req.body.price_range, req.params.id]
		);

		res.status(200).json({
			status: 'success',
			data: {
				restaurants: updatedRestaurant.rows[0],
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

// Delete restaurant
router.delete('/:id', async (req, res) => {
	try {
		const deletedRestaurants = await db.query(
			`DELETE FROM restaurants WHERE id = $1 returning *`,
			[req.params.id]
		);

		res.status(200).json({
			status: 'success',
			data: {
				restaurant: deletedRestaurants.rows[0],
			},
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

// Add review
router.post('/:id/addreview', async (req, res) => {
	try {
		const addedReviews = await db.query(
			`INSERT INTO reviews (restaurants_id, name, review, rating) VALUES ($1, $2, $3, $4) returning *`,
			[req.params.id, req.body.name, req.body.review, req.body.rating]
		);

		res.status(200).json({
			status: 'success',
			data: {
				restaurant: addedReviews.rows[0],
			},
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
