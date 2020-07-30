const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const fs = require('fs');
const csvtojson = require('csvtojson');
const helmet = require('helmet');

//Routes
const covidRouter = require('./routes/covidTracking');

//Production port configuration
const server_port = process.env.PORT || 3000;

//Initialize express server
const app = express();
app.listen(server_port, () => console.log('listening @ 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));
app.use( helmet() );

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

//Local File Methods
//Generic GET request
app.get('/gini', async (request, response) => {
	let file = 'data/GINI.csv';
	console.log(`${file} requested`);
	//Convert CSV to JSON
	csvtojson()
		.fromFile(file)
		.then((json) => {
			//Filter out all but most recent year
			res = filterRecentYear(json);
			//Move all children up a level
			inverted = res.map( line => line = line[0]);
			response.json(inverted);
		})
})

app.get('/countryCodeMatrix', async (request, response) => {
	let file = 'data/countryCodeMatrix.csv';
	let matrix = await csvtojson().fromFile(file);
	response.json(matrix);
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
	let url = "https://covidtracking.com/api/v1/us/current.json";
	
	return url;
}

// UPDATE FUNCTIONS //

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

//Replace current cache of US data
let updateUsaDatabase = async () => {
	let url = getUsaDataUrl;
	console.log(`Fetching ${url}`);
}

let mergeRecentEntry =  (result) => {
	let apiDate = result.Date;
	console.log(`Api Date: ${apiDate}`);
	
	worldDatabase.find({}, (err, doc) => {
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

//Conversion Functions//
//Function for conversion of GINI data to simplified format
//Only distinct years that are the 
let filterRecentYear = (data, year) => {
	let result = [];
	let log = []
	try {
		countryArray = [...new Set(data.map( x => x.LOCATION ))];
		countryArray.forEach( (country) => {
			let subset = data.filter( line => line.LOCATION == country);
			let recentYearAsString = getMax(subset, c => parseInt(c.TIME));
			result.push( subset.filter( y => y.TIME == recentYearAsString));
			
		});
	} catch(err) {
		console.error(err);
	}
	
	return result;
}

let getMax = (data, filter) => {
	let max = 0;
	try {
		for( item of data ) {
			if (filter(item) > max) {max = filter(item)};
		}
		return max;
		
	} catch (err) {
		console.error(err);
	}
}
// Update database at interval of 10 minutes
//updateWorldDatabase(); //Update on init
//updateWorldDatabase();
updateUsaDatabase();
setInterval( async () => updateWorldDatabase(), 2400 * 1000);




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