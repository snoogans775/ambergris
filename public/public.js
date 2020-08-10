//Covid Data Tracker
//Kevin Fredericks 2020
//LICENSE: MIT
//Data sourced from:
// Covid Tracking Project 
// OECD GINI scores
// Transparency International

import * as Get from './modules/requests.js';
import * as EventHandler from './modules/events.js';
import TableView from './modules/TableView.js';
import webElement from './modules/webElement.js';
import UI from './modules/ui.js';
import './modules/nouislider.min.js';

const display = async () => {
	//Fetching data from API
	//This syntax only works within an async scope
	const dataBundle = {
		worldData: await Get.worldCovid(), 
		flagSources: await Get.flags(), 
		countryDetails: await Get.countryDetails(), 
		countryCodeMatrix: await Get.conversionMatrixJSON()
	};
	
	//Render title
	let head = webElement({element: 'h2', textContent: 'Ambergris'});
	let subtitle = webElement({element: 'p', textContent: 'Covid-19 Data Tracker'});
	head.appendChild(subtitle);

	//Create UI
	let ui = UI(dataBundle);

	//Create table
	let table = TableView(dataBundle);

	//Put everything together
	let root = document.querySelector('#root');
	root.append(head);
	root.append(ui);
	root.append(table);
}

//Display data using async function
display();