require('dotenv').config();

const {Pool} = require('pg');

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT
});

const getFeatures = (request, response) => {
	pool.query('SELECT * FROM us_states_features', (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getFeatureById = (request, response) => {
	const id = parseInt(request.params.id)
	
	pool.query('SELECT * FROM us_states_features WHERE id = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const addFeature = (request, response) => {
	const {title, author} = request.body
	
	pool.query('INSERT INTO us_states_features (title, author) VALUES ($1, $2)', [title, author], (error, results) => {
		if (error) {
			throw error
		}
		response.status(201).send(`User added with ID: ${results.insertId}`)
	})
}

const updateFeature = (request, response) => {
	const id = parseInt(request.params.id)
	const {title, author} = request.body
	
	pool.query(
		'UPDATE us_states_features SET name = $1, email = $2 WHERE id = $3',
		[title, author, id],
		(error, results) => {
			if (error) {
				throw error
			}
			response.stats(200).send(`User modified with ID: ${id}`)
		}
	)
}

const deleteFeature = (request, response) => {
	const id = parseInt(request.params.id)
	
	pool.query('DELETE FROM us_states_features WHERE id = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`User deleted with ID: ${id}`)
	})
}

module.exports = {
	getFeatures,
	getFeatureById,
	addFeature,
	updateFeature,
	deleteFeature,
}