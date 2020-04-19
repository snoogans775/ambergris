const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const fs = require('fs');

//Initialize express server
const app = express();
app.listen(3001, () => console.log('listening @ 3001'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

//Initialize world database
const worldDatabase = new Datastore('collections/world.db');
worldDatabase.loadDatabase();
//Initialize US database
const usDatabase = new Datastore('collections/us.db');
usDatabase.loadDatabase();

//Internal API Methods
//Global data GET request
app.get('/world', async (request, response) => {
	worldDatabase.find({}, (err, data) => {
		if (err) {
			response.end();
			return;
		}
		response.json(data);
	})
})

//USA data GET request
app.get('/us', async (request, response) => {
	usDatabase.find({}, (err, data) => {
		if (err) {
			response.end();
			return;
		}
		response.json(data);
	})
})

//OECD Local File Method
//Generic GET request
app.get('/oecd', async (request, response) => {
	let file = 'data/oecd-wealth.json';
	console.log(`${file} requested.`);
	fs.readFile(file, 'utf8', (err, data) => {
		response.json(JSON.parse(data));
	});
})

//External API methods
let getWorldData = (option = 1) => {
	//Get the last update from most recent db entry
	let url = "https://corona-virus-stats.herokuapp.com/api/v1/cases/";
	let queries = ['general-stats', 'countries-search'];
	url += queries[option];
	
	return url;
}

let getUsData = (option) => {
	let url = "https://covidtracking.com/api/v1/states/daily.json";
	
	return url;
}

//Cache database with new API result from world API
let updateWorldDatabase = async () => {
	//Get the last update from most recent db entry
	let url = getWorldData();
	console.log(`Fetching ${url}`);
	let requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	const res = await fetch(url, requestOptions);
	const result = await res.json();
	checkRecentEntry(result);
}

let checkRecentEntry = (result) => {
	console.log(result);
	let apiDate = result.data.last_update;
	
	worldDatabase.find({}, (err, doc) => {
		let dbDate = doc[0].data.last_update;
		let msg = '';
		if (apiDate == dbDate) {
			msg = `Match found for world data entry: ${dbDate}`;
		} else {
			//FIXME: check for change in date format (Kevin: 05/11/20 11:38:00)
			msg =`Updating world data with data from ${apiDate}`;
			msg += `\n Most recent API entry: ${dbDate}`;
			worldDatabase.insert(result);
		};
		
		console.log(msg);
	});
}

// Update database at interval of 10 minutes
updateWorldDatabase(); //Update on init
setInterval( async () => {
	updateWorldDatabase();
}, 60 * 10000);






//POST request to world database
//Deprecated 5-19-20 by Kevin
/*
app.post('/world'), async (request, response) => {
	const data = request.body;
	try {
		data.timestamp = Date.now();
		worldDatabase.insert(data);
		response.json('Success');
	} catch (err) {
		console.log(err);
	}
}
*/