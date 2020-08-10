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
	//Create value multiplier
	let logSlider = webElement({element: 'div',id: 'logSlider'});
	//Configure Slider
	noUiSlider.create(logSlider, {
		start: [1],
		connect: true,
		range: {
			'min': 1,
			'max': 50
		}
	});
	//Create table
	let table = createTable(dataBundle);

	//Put everything together
	let root = document.querySelector('#root');
	root.append(head);
	root.append(logSlider);
	root.append(table);
	
	//Assign event listeners
	//This could be done asynchronously
	//but it is simpler to do it now, knowing that all divs are in the DOM
	EventHandler.bind(logSlider);
}

//GUI functions//
//Render elements
let createHeader = () => {
	let header = webElement({element:'div', class: 'header'});
	header.append(
		webElement({element: 'div', class: 'header-text', textContent: 'Country'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Total Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'New Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Fatality'}),
		webElement({element: 'div', class: 'header-text', textContent: 'GINI'})
	);
	
	return header;
}

let createUI = (data) => {
	let ui = webElement({element: 'div', id: 'ui-container'});
	//Create region selector
	let regionLabel = webElement({
		element: 'div', 
		id: 'region-selector-label',
		textContent: 'Region'
	});
	let regionSelector = webElement({element: 'select', id: 'region-selector'});
	let regions = [...new Set(data.map( c => c.region ))];
	regions.map(region => {
		let option =  webElement({
			element: 'option',
			value: region,
			textContent: region
		});
		regionSelector.appendChild(option);
	});

	//Put it all together
	ui.append(regionLabel, regionSelector);

	//Bind event handlers
	EventHandler.bind(regionSelector);

	return ui;
}

let createTable = (data) => {
	//Data constants
	const worldData = data['worldData'];
	const flagSources = data['flagSources'];
	const countryDetails = data['countryDetails'];
	const countryCodeMatrix = data['countryCodeMatrix'];

	//Create table
	let header = createHeader();
	let container = webElement({
		element: 'div', 
		class: 'entry-container',
		id: 'country-table'
	});
	container.append(header);

	let dataSet = worldData.Countries;

	// Create contents of current entry
	for (let item of worldData.Countries ) {
		let entry = webElement({
			element: 'div', 
			class: 'entry',
			id: `${item.CountryCode}-entry`
		});
		let flagImg = webElement({
			element: 'img', 
			class: 'flag', 
		});
		let countryName = webElement({
			element: 'div', 
			class: 'country-name', 
			textContent: item.Country
		});
		let totalCasesContainer = webElement({
			element: 'div',
			class: 'totalCases-barContainer',
		})
		let totalCasesBar = webElement({
			element: 'div',
			class: 'totalCases-bar',
			id: `${item.CountryCode}-total-cases-bar`
		});
		let newCasesContainer = webElement({
			element: 'div',
			class: 'newCases-barContainer',
		})
		let newCasesBar = webElement({
			element: 'div',
			class: 'newCases-bar',
			id: `${item.CountryCode}-new-cases-bar`
		});
		let wealthContainer = webElement({
			element: 'div',
			class: 'wealth-container'
		})
		let wealthIndicator = webElement({
			element: 'div',
			class: 'generic-indicator'
		})
		let fatalityContainer = webElement({
			element: 'div',
			class: 'fatality-container'
		})
		let fatalityIndicator = webElement({
			element: 'div',
			class: 'fatality-indicator',
			id: `${item.CountryCode}-fatality-indicator`
		})

	//Constants for use in calculation
	const MAX_TOTAL_CASES = Compute.max(worldData.Countries, c => c.TotalConfirmed);
	const MAX_NEW_CASES = Compute.max(worldData.Countries, c => c.NewConfirmed);
	
	//Style elements //
	
	//Get source image for flag
	//Slight differences in naming convention of country code
	let flag = flagSources.filter( c => c.countryCode == item.CountryCode);
	if (flag) flagImg.src = flag[0].flagSource;
	
	//Convert total cases to a percentage of highest caseload country
	let totalCases = Compute.percent(item.TotalConfirmed, MAX_TOTAL_CASES);
	totalCasesBar.value = totalCases;
	totalCasesBar.style.width = `${totalCases}%`;
	
	//Convert total cases to a percentage of highest caseload country
	let newCases = Compute.percent(item.NewConfirmed, MAX_NEW_CASES);
	newCasesBar.value = newCases;
	newCasesBar.style.width = `${newCases}%`;
	
	//Place wealth disparity indicator according to GINI score
	let giniScore = Compute.GINI(item.CountryCode, countryDetails, countryCodeMatrix);
	wealthIndicator.style.marginLeft = `${giniScore}%`;
	
	//Place fatality indicator
	let fatality = Compute.fatality(item);
	fatalityIndicator.value = fatality;
	fatalityIndicator.style.marginLeft = `${fatality}%`;

	//Construct the pretty bar graphs
	totalCasesContainer.appendChild(totalCasesBar);
	newCasesContainer.appendChild(newCasesBar);
	fatalityContainer.appendChild(fatalityIndicator);
	wealthContainer.appendChild(wealthIndicator);
	
	//Construct the entry
	entry.append(
		flagImg, 
		countryName, 
		totalCasesContainer,
		newCasesContainer,
		fatalityContainer,
		wealthContainer
	);
	container.append(entry);
	}

	return container;
}

//Custom webElement Creator
let webElement = (obj) => {
	//Create new element
	let ele = document.createElement(obj.element);
	//Assign attributes for all correctly named object keys
	//This relies on the string name in the object to be correct, dangerous
	const keys = Object.keys(obj);
	keys.forEach( (key, index) => {
		ele.setAttribute(key, obj[key]);
	});
	
	//Assign content of element
	ele.textContent = obj.textContent;
	return ele;
}

//Display data
display();