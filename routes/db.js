const Datastore = require('nedb');
const fs = require('fs');
const csvtojson = require('csvtojson');

//Initialize world database
const worldDatabase = new Datastore('./../collections/world.db');
worldDatabase.loadDatabase();

//Initialize US database
const usDatabase = new Datastore('./../collections/us.db');
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
//Get inequality data
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

//Country code conversion matrix
app.get('/countryCodeMatrix', async (request, response) => {
	let file = 'data/countryCodeMatrix.csv';
	let matrix = await csvtojson().fromFile(file);
	response.json(matrix);
})

//Images for flags
app.get('/flags', async (request, response) => {
	let file = 'data/flags.json';
	fs.readFile(file, (err, data) => {
		if (err) throw err;
		let flagSources = JSON.parse(data);
		response.json(flagSources);
		
	});
})