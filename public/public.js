//Covid Data Tracker
//Kevin Fredericks 2020
//LICENSE: MIT
//Data sourced from:
// Covid Tracking Project 
// OECD GINI scores
// Transparency International

//Constants for Event Handlers
const DAMPENER = 5;
let isMouseDown = false;

const display = async () => {
	//Fetching data from API
	const worldData = await getWorldCovid();
	const flagSources = await getCountryData();
	const giniData = await getWealth();
	const countryCodeMatrix = await getConversionMatrixJSON();
	const dataBundle = {
		worldData: worldData, 
		flagSources: flagSources, 
		giniData: giniData, 
		countryCodeMatrix: countryCodeMatrix
	};
	
	//Render title
	let title = webElement({
		element: 'h2',
		textContent: 'Ambergris'
	})
	let subtitle = webElement({
		element: 'p',
		textContent: 'Covid-19 Data Tracker'
	})
	title.appendChild(subtitle);
	//Render value multiplier
	let logMultiplier = createLogMultiplier();
	let table = createTable(dataBundle);
	
	//Put everything together
	let root = document.querySelector('#root');
	root.append(title);
	root.append(logMultiplier);
	root.append(table);
	
	//Assign event listeners
	//This could be done asynchronously
	//but it is simpler to do it now, knowing that all divs are in the DOM
	assignEventListeners();
}

//GUI functions//
//Render GUI elements
let createLogMultiplier = () => {
	let logMultiplierContainer = webElement({
		element: 'div',
		class: 'log-multiplier-container',
		id: 'log-multiplier-container' 
	})
	let logMultiplierIndicator = webElement({
		element: 'div',
		class: 'generic-indicator',
		id: 'log-multiplier-indicator',
	})
	
	logMultiplierContainer.appendChild(logMultiplierIndicator);
	
	return logMultiplierContainer;
}

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

let createTable = (data) => {
	//Data constants
	const worldData = data['worldData'];
	const flagSources = data['flagSources'];
	const giniData = data['giniSources'];
	const countryCodeMatrix = data['countryCodeMatrix'];
	//Constants for use in calculation
	const MAX_TOTAL_CASES = getMax(worldData.Countries, c => c.TotalConfirmed);
	const MAX_NEW_CASES = getMax(worldData.Countries, c => c.NewConfirmed);

	//Create table
	let header = createHeader();
	let container = webElement({
		element: 'div', 
		class: 'entry-container'
	});
	container.append(header);

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
	
	//Style elements //
	
	//Get source image for flag
	//Slight differences in naming convention of country code
	let flag = flagSources.filter( c => c.countryCode == item.CountryCode);
	if (flag) flagImg.src = flag[0].flagSource;
	
	//Convert total cases to a percentage of highest caseload country
	let totalCases = toPercent(item.TotalConfirmed, MAX_TOTAL_CASES);
	totalCasesBar.value = totalCases;
	totalCasesBar.style.width = `${totalCases}%`;
	
	//Convert total cases to a percentage of highest caseload country
	let newCases = toPercent(item.NewConfirmed, MAX_NEW_CASES);
	newCasesBar.value = newCases;
	newCasesBar.style.width = `${newCases}%`;
	
	//Place wealth disparity indicator according to GINI score
	let giniScore = getGINI(item.CountryCode, giniData, countryCodeMatrix);
	wealthIndicator.style.marginLeft = `${giniScore}%`;
	
	//Place fatality indicator
	let fatality = getFatality(item);
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

//Event Handlers and Listeners
let assignEventListeners = () => {
	console.log(isMouseDown);
	let multiplier = document.querySelector('#log-multiplier-container');
	let multiplierIndicator = document.querySelector('#log-multiplier-indicator');

	//Create unique attribute for width of slider
	multiplierIndicator.absoluteWidth = multiplierIndicator.clientWidth;

	//Control focus on slider
	multiplierIndicator.addEventListener('mousedown', focusSlider);
	multiplier.addEventListener('mouseup', removeFocusSlider);
	multiplier.addEventListener('mouseout', removeFocusSlider);

	//Move slider indicator
	multiplier.addEventListener('mousemove', moveIndicator);
	
	//Eventlisteners for all indicators
	let fatalityIndicators = document.querySelectorAll('.fatality-indicator');
	for(let indicator of fatalityIndicators) {
		indicator.addEventListener('slidermove', updateFatality);
	}
	//Eventlisteners for all bars
	let allBars = document.querySelectorAll('.totalCases-bar', '.newCases-bar');
	for(let bar of allBars) {
		bar.addEventListener('slidermove', updateBar);
	}
}

let focusSlider = (event) => {
	let indicator = document.querySelector('#log-multiplier-indicator');
	setPosition(indicator, event.offsetX);
	isMouseDown = true;
}

let removeFocusSlider = (event) => {
	isMouseDown = false;
	console.log(isMouseDown);
}

let moveIndicator = (event) => {
	console.log(isMouseDown);
	if (isMouseDown) {
		//Define slider from DOM
		let container = document.querySelector('#log-multiplier-container');
		let indicator = document.querySelector('#log-multiplier-indicator');
		let offset = event.offsetX - indicator.absoluteWidth/2;
		
		//Update slider position
		let upperBound = container.clientWidth;
		//Check for right edge and move
		let newPosition = (offset <= upperBound) ? `${offset}px` : `${upperBound}px`;
		setPosition(indicator, newPosition);
		
		let slidermove = sliderMoveEvent(offset);
		updateIndicatorsAll(slidermove);
	}

}

let setPosition = (indicator, leftOffset) => {
	//Check for right edge and move
	indicator.style.paddingLeft = leftOffset;
}

let updateIndicatorsAll = (event) => {
	//Update fatality indicators
	let fatalityIndicators = document.querySelectorAll('.fatality-indicator');
	for(let indicator of fatalityIndicators){
		indicator.dispatchEvent(event);
	}
	let totalCasesBars = document.querySelectorAll('.totalCases-bar');
	for(let bar of totalCasesBars){
		bar.dispatchEvent(event);
	}
}

let updateFatality = (event) => {
	const dampener = DAMPENER; //Higher values dampen the effect
	let indicator = event.target;
	let multiplier = getNaturalLog(event.detail.value, dampener);
	let adjustedValue = getNaturalLog(indicator.value, multiplier);
	
	//Update indicator
	indicator.style.marginLeft = `${adjustedValue}%`;
}

let updateBar = (event) => {
	const dampener = DAMPENER; //Higher values dampen the effect
	let bar = event.target;
	let multiplier = getNaturalLog(event.detail.value, dampener);
	let adjustedValue = getNaturalLog(bar.value, multiplier);
	
	//Update indicator
	bar.style.width = `${adjustedValue}%`;
}

//Custom event to update all indicators and bars
let sliderMoveEvent = (value = 1) => {
	let slidermove = new CustomEvent(
		'slidermove',
		{
			detail: {
				value: value
			},
			bubbles: true,
			cancelable: true
		}
	);
	
	return slidermove;
}

//Custom event to add click and drag to slider
let sliderFocusEvent = () => {
	let sliderclick = new CustomEvent(
		'sliderclick',
		{
			detail: {
				description: 'focus event for hover functionality'
			},
			bubbles: true,
			cancelable: true
		}
	);
	
	return sliderclick;
}

//Computation functions//
let toPercent = (value, total) => {
	let result = Math.ceil( (value / total) * 100 );
	return result;
}

let getMax = (data, filter) => {
	let max = 0;
	try {
		for( let item of data ) {
			if (filter(item) > max) {max = filter(item)};
		}
		return max;
		
	} catch (err) {
		console.error(err);
	}
}

let getNaturalLog = (value, multiplier = 1) => {
	return ( Math.log(value) * multiplier ) + 0.5;
}

let getFatality = (countryObject) => {
	//Return a decimal value of country fatality rate
	try {
		let fatality = toPercent(countryObject.TotalDeaths, countryObject.TotalConfirmed);
		let result = Math.ceil(fatality);
		return result;
		
	} catch (err) {
		console.error(err);
	}
}

let getGINI = (countryCode, data, matrix) => {
	try {
		//Check for shortened country codes
		let code = matrix.filter( line => line.AlphaTwo == countryCode)[0].AlphaThree;
		let giniLine = data.filter( line => line.LOCATION == code )[0];
		let result = giniLine.Value * 100; //Convert to percentage
		return result;
	} catch (err) {
		return 0;
	}
}

//Requests made to server//
const getCountryData = async (countryCode) => {
	const response = await fetch('/flags');
	const data = await response.json();
	return data;
}

const getWorldCovid = async () => {
	const response = await fetch('/world');
	const data = await response.json();
	return data;
}

const getUsaCovid = async () => {
	const response = await fetch('/usa');
	const data = await response.json();
	return data;
}

const getWealth = async () => {
	const response = await fetch('/gini');
	const data = await response.json();
	return data;
}

const getConversionMatrixJSON = async () => {
	const response = await fetch('/countryCodeMatrix');
	const data = await response.json();
	return data;
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