import WebElement from './modules/WebElement.js';
import * as Get from './modules/Requests.js';

const display = async () => {
    const dataset = await Get.worldCovid();
    console.log(dataset);

    // Show chart of covid data
    let subset = dataset.Countries;

    d3.select('#content')
        .selectAll('tr')
        .data(subset)
        .enter().append('tr')
        .html( (d) => {
            return '<th scope="row">' + d.CountryCode +
                '</th>'
        })

}

// Add dummy data to to the navbar
let pages = ['Explore', 'Global', 'United States'];

// Add values to navbar
var navbar = d3.select('#navbar')
    .selectAll('div')
    .data(pages);

navbar.enter()
    .append('div')
    .merge(navbar)
    .text( d => {return d;});

    display();
		
		let mapboxAccessToken = "sk.eyJ1Ijoic25vb2dhbnM3NzUiLCJhIjoiY2tmdmhyaXM5MHQ3eDJzcDliMGJzbG9lYyJ9.ARXzU9Dn3-9Q6sqZhs2kig";
		let chloroMap = L.map('map').setView([37.8, -96], 4);

// LEAFLET AND DISPLAY FUNCTIONS //

	// API Requests
	const getFeatures = async () => {
		const response = await fetch('/features');
		const data = await response.json();
		return data;
	}

	//Style Functions
	const getColor = (d) => {
	    return d > 1000 ? '#800026' :
	           d > 500  ? '#BD0026' :
	           d > 200  ? '#E31A1C' :
	           d > 100  ? '#FC4E2A' :
	           d > 50   ? '#FD8D3C' :
	           d > 20   ? '#FEB24C' :
	           d > 10   ? '#FED976' :
	                      '#FFEDA0';
	}

	const style = (feature) => {
		return {
			fillColor: getColor(feature.properties.density),
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		};
	}

	//View Layer
	const display = async () => {
		let statesData = await getFeatures();

		L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
			id: 'mapbox/light-v9',
			attribution: 'kevin',
			tileSize: 512,
			zoomOffset: -1
		}).addTo(chloroMap);

		L.geoJson(statesData, {style: style}).addTo(chloroMap);
	}

	display();