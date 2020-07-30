//Covid Data Tracker
//Kevin Fredericks 2020
//LICENSE: MIT
//Data sourced from:
// Covid Tracking Project 
// OECD GINI scores
// Transparency International

//Constants for Event Handlers
const DAMPENER = 5;

//Directory constants
const LOC = window.location.pathname;
const DIRECTORY = LOC.substring(0, LOC.lastIndexOf('/'));

const display = async () => {
	//Fetching data from API
	const worldData = await getWorldJSON();
	const giniData = await getWealthJSON();
	const countryCodeMatrix = await getConversionMatrixJSON();
	
	//Constants for use in calculation
	const MAX_TOTAL_CASES = getMax(worldData.Countries, c => c.TotalConfirmed);
	const MAX_NEW_CASES = getMax(worldData.Countries, c => c.NewConfirmed);
	
	//Render title
	let title = webElement({
		element: 'h1',
		textContent: 'Ambergris'
	})
	let subtitle = webElement({
		element: 'h2',
		textContent: 'Covid-19 Data Tracker' + DIRECTORY
	})
	title.appendChild(subtitle);
	//Render value multiplier
	let logMultiplier = createLogMultiplier();
	//Create table
	let header = createHeader();
	let container = webElement({
		element: 'div', 
		class: 'container'
	});
	
	// Create contents of current entry
	for (let item of worldData.Countries ) {
		let entry = webElement({
			element: 'div', 
			class: 'entry',
			id: `${item.CountryCode}-entry`
		});
		let flag = webElement({
			element: 'img', 
			class: 'flag', 
			src: `${DIRECTORY}/flags/${item.CountryCode}.png`
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
			flag, 
			countryName, 
			totalCasesContainer,
			newCasesContainer,
			fatalityContainer,
			wealthContainer
		);
		container.append(entry);
	}
	
	//Put everything together
	let root = document.querySelector('#root');
	root.append(title);
	root.append(logMultiplier);
	root.append(header);
	root.append(container);
	
	//Assign event listeners
	//This could be done asynchronously
	//but it is simpler to do it now, knowing that all divs are in the DOM
	assignEventListeners();
}

//GUI functions//
let assignEventListeners = () => {
	//Multiplier for slider
	let multiplier = document.querySelector('#log-multiplier-container');
	//create unique attribute for width of slider at init
	let multiplierIndicator = document.querySelector('#log-multiplier-indicator');
	multiplierIndicator.absoluteWidth = multiplierIndicator.clientWidth;
	multiplier.addEventListener('mousemove', slideMultiplier);
	
	//Eventlisteners for all indicators
	let fatalityIndicators = document.querySelectorAll('.fatality-indicator');
	for(let indicator of fatalityIndicators) {
		indicator.addEventListener('slidermove', updateFatality);
	}
	let allBars = document.querySelectorAll('.totalCases-bar', '.newCases-bar');
	for(let bar of allBars) {
		bar.addEventListener('slidermove', updateBar);
	}
	
}

let slideMultiplier = (event) => {
	//Define slider in DOM
	let container = document.querySelector('#log-multiplier-container');
	let slider = document.querySelector('#log-multiplier-indicator');
	let offset = event.offsetX;
	
	//Update slider position
	let sliderWidth = slider.clientWidth;
	let upperBound = container.clientWidth - slider.absoluteWidth;
	let rightMargin = slider;
	slider.style.paddingLeft = (offset <= upperBound) ? `${offset}px` : `${upperBound}px`;
	
	let slidermove = createSliderEvent(offset);
	updateIndicatorsAll(slidermove);

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

let createSliderEvent = (value = 1) => {
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

//Computation functions//
let toPercent = (value, total) => {
	let result = Math.floor( (value / total) * 100 );
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
		let result = Math.round(fatality);
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
const getWorldJSON = async () => {
	const response = await fetch('/world');
	const data = await response.json();
	return data;
}

const getUsaJSON = async () => {
	const response = await fetch('/usa');
	const data = await response.json();
	return data;
}

const getWealthJSON = async () => {
	const response = await fetch('/gini');
	const data = await response.json();
	return data;
}

const getConversionMatrixJSON = async () => {
	const response = await fetch('/countryCodeMatrix');
	const data = await response.json();
	return data;
}

//More generalized version of webElement
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

let setLogMultiple = (value) => {
	logMultiple = value;
}

let createHeader = () => {
	let header = webElement({element:'div', class: 'header'});
	header.append(
		webElement({element: 'div', class: 'header-text', textContent: 'Country'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Total Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'New Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Fatality'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Inequality Index'})
	);
	
	return header;
}

//Display data and run tests
display();

