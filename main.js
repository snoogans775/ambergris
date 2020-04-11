const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

const app = express();
app.listen(3001, () => console.log('listening @ 3001'));
app.use(express.static('public'));
app.use(express.json({limi: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();


app.get('/covid', async (request, response) => {
	//countries data
	//object -> 
	let url = "https://corona-virus-stats.herokuapp.com/api/v1/cases/";
	let queries = ['general-stats', 'countries-search'];
	url += queries[1];
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	
	const res = await fetch(url, requestOptions);
	const result = await res.json();

	response.json(result.data.rows);
})