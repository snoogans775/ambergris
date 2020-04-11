const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

//Initialize express server
const app = express();
app.listen(3001, () => console.log('listening @ 3001'));
app.use(express.static('public'));
app.use(express.json({limi: '1mb'}));

//Initialize neDB
const database = new Datastore('database.db');
database.loadDatabase();

//Generic GET request
app.get('/covid', async (request, response) => {
	database.find({}, (err, data) => {
		if (err) {
			response.end();
			return;
		}
		response.json(data);
	})
})

//Generic POST request
app.post('/covid'), async (request, response) => {
	const data = request.body;
	try {
		data.timestamp = Date.now();
		database.insert(data);
		response.json('Success');
	} catch (err) {
		console.log(err);
	}
}

//Cache database with new API result
var updateDatabase = async () => {
	//Get the last update from most recent db entry
	let url = "https://corona-virus-stats.herokuapp.com/api/v1/cases/";
	let queries = ['general-stats', 'countries-search'];
	url += queries[1];
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	const res = await fetch(url, requestOptions);
	const result = await res.json();
	checkRecentEntry(result);
}

var checkRecentEntry = (result) => {
	let apiDate = result.data.last_update;
	console.log(`Most recent API entry: ${apiDate}`);
	
	database.find({}, (err, doc) => {
		let dbDate = doc[0].data.last_update;
		let msg = '';
		if (apiDate === dbDate) {
			msg = `Match found for database entry: ${dbDate}`;
		} else {
			//FIXME: check for change in date format (Kevin: 05/11/20 11:38:00)
			msg =`Updating database with data from ${apiDate}`;
			database.insert(result);
		};
		
		console.log(msg);
	});
}

// Update database at interval of 1 minute
updateDatabase();
setInterval( async () => {
	updateDatabase();
}, 60 * 1000);