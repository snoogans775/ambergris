//Covid Data Tracker
//Kevin Fredericks 2020
//LICENSE: MIT
//Data sourced from:
// Covid Tracking Project 
// OECD GINI scores
// Transparency International

const displayData = async () => {
	//Fetching data from API
	const worldData = await getWorldJSON();
	const giniData = await getWealthJSON();
	const countryCodeMatrix = await getConversionMatrixJSON();
	
	//Constants for use in calculation
	const MAX_TOTAL_CASES = getMax(worldData.Countries, c => c.TotalConfirmed);
	const MAX_NEW_CASES = getMax(worldData.Countries, c => c.NewConfirmed);
	
	//Create table
	let header = createHeader();
	let container = webElement({
		element: 'div', 
		class: 'container'
	});
	
	// Create contents of current entry
	for ( item of worldData.Countries ) {
		let entry = webElement({
			element: 'div', 
			class: 'entry',
			id: `${item.CountryCode}-entry`
		});
		let flag = webElement({
			element: 'img', 
			class: 'flag', 
			src: `flags/${item.CountryCode}.png`
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
			class: 'totalCases-bar'
		});
		let newCasesContainer = webElement({
			element: 'div',
			class: 'newCases-barContainer',
		})
		let newCasesBar = webElement({
			element: 'div',
			class: 'newCases-bar'
		});
		let wealthContainer = webElement({
			element: 'div',
			class: 'wealth-container'
		})
		let wealthIndicator = webElement({
			element: 'div',
			class: 'wealth-indicator'
		})
		
		//Convert total cases to a percentage of highest caseload country
		let totalWidth = toPercent(item.TotalConfirmed, MAX_TOTAL_CASES);
		totalCasesBar.style.width = `${totalWidth}%`;
		
		//Convert total cases to a percentage of highest caseload country
		let newWidth = toPercent(item.NewConfirmed, MAX_NEW_CASES);
		newCasesBar.style.width = `${newWidth}%`;
		
		//Place wealth disparity indicator according to GINI score
		let giniScore = getGINI(item.CountryCode, giniData, countryCodeMatrix);
		wealthIndicator.style.marginLeft = `${giniScore}%`;
		``
		//Construct the pretty bar graphs
		totalCasesContainer.appendChild(totalCasesBar);
		newCasesContainer.appendChild(newCasesBar);
		wealthContainer.appendChild(wealthIndicator);
		
		//Construct the entry
		entry.append(
			flag, 
			countryName, 
			totalCasesContainer,
			newCasesContainer,
			wealthContainer
		);
		container.append(entry);
	}
	
	//Put everything together
	let root = document.querySelector('#root');
	root.append(header);
	root.append(container);
}

let assignEventListeners = () => {
	let entry = document.querySelector('#AF-entry');
	entry.addEventListener('click', entryClicked);
}

//Computation functions
let toPercent = (value, total) => {
	let result = Math.floor( (value / total) * 100 );
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

let naturalLog = (value, multiplier = 1) => {
	return ( Math.log(value) * multiplier ) + 0.5;
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

//GUI functions//
let entryClicked = (event) => {
	console.log('clicked!');
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

let createHeader = () => {
	let header = webElement({element:'div', class: 'header'});
	header.append(
		webElement({element: 'div', class: 'header-text', textContent: 'Country'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Total Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'New Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Inequality Index'})
	);
	
	return header;
}

//Display data and run tests
displayData();
assignEventListeners();

