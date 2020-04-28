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
	worldDatabase.findOne({}, (err, data) => {
		if (err) {
			response.end();
			return;
		}
		response.json(data);
		console.log(data);
	})
})

//USA data GET request
app.get('/usa', async (request, response) => {
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
	console.log(`${file} requested`);
	fs.readFile(file, 'utf8', (err, data) => {
		response.json(JSON.parse(data));
	});
})

//External API methods
let getWorldDataUrl = (option = 0) => {
	//Get the last update from most recent db entry
	let url = "https://api.covid19api.com/";
	let queries = ['summary'];
	url += queries[option];
	
	return url;
}

let getUsaDataUrl = (option) => {
	let url = "https://covidtracking.com/api/v1/states/daily.json";
	
	return url;
}

//Replace current cache of US data
let updateUsDatabase = async () => {
	let url = getUsDataUrl;
	console.log(`Fetching ${url}`);
}

//Cache database with new API result from world API
let updateWorldDatabase = async () => {
	//Get the last update from most recent db entry
	let url = getWorldDataUrl();
	console.log(`Fetching ${url}`);
	let requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	
	try {
		const res = await fetch(url, requestOptions);
		const result = await res.json();
		setInterval(mergeRecentEntry(result), 1000 * 1);
		
	} catch (err) {
		console.log( err );
	}
}

let mergeRecentEntry =  (result) => {
	let apiDate = result.Date;
	console.log(`Api Date: ${apiDate}`);
	
	worldDatabase.find({Date: apiDate}, (err, doc) => {
		try {
		let dbDate = doc[0].Date;
		let msg = '';
		if (apiDate == dbDate) {
			msg = `Match found in db for world data entry: ${dbDate}`;
		} else {
			//FIXME: check for change in date format (Kevin: 05/11/20 11:38:00)
			msg =`Updating world data with data from ${apiDate}`;
			msg += `\n Most recent database entry: ${dbDate}`;
			worldDatabase.insert(result);
		};
		
		console.log(msg);
	} catch (err) {
		console.log(err);
	}
	});
}
// Update database at interval of 10 minutes
//updateWorldDatabase(); //Update on init
setInterval( async () => {
	updateWorldDatabase();
}, 240 * 1000);






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