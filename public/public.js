const displayData = async () => {
	//Fetching data from API
	let worldData = await getWorldJSON();
	console.log(worldData);
	
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
		
		//Convert total cases to a percentage of highest caseload country
		let totalWidth = ( item.TotalConfirmed / MAX_TOTAL_CASES ) * 100;
		totalCasesBar.style.width = `${totalWidth}%`;
		
		//Convert total cases to a percentage of highest caseload country
		let newWidth = ( item.NewConfirmed / MAX_NEW_CASES ) * 100;
		newCasesBar.style.width = `${newWidth}%`;
		
		//Construct the pretty bar graphs
		totalCasesContainer.appendChild(totalCasesBar);
		newCasesContainer.appendChild(newCasesBar);
		
		//Construct the entry
		entry.append(
			flag, 
			countryName, 
			totalCasesContainer,
			newCasesContainer
		);
		container.append(entry);
	}
	
	// Put everything together
	let root = document.querySelector('#root');
	root.append(header);
	root.append(container);
}

//Computation functions

let toPercent = (value, total) => {
	let result = Math.floor( (value / total) * 100 );
	return result;
}

let getMax = (data, filter) => {
	let max = 0;
	let log = [];
	log.push({'init': 'Starting max calc'});
	log.push({'data': data});
	try {
		for( item of data ) {
			if (filter(item) > max) {max = filter(item)};
		}
		return max;
		
	} catch (err) {
		console.error(err);
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
	const response = await fetch('/oecd');
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
	//Define attributes for all correctly named object keys
	//This relies on the string name in the object to be correct, dangerous
	const keys = Object.keys(obj);
	keys.forEach( (key, index) => {
		ele.setAttribute(key, obj[key]);
	});
	
	ele.textContent = obj.textContent;
	return ele;
}

//Element function, deprecated
let webElementDeprecated = (obj) => {
	let ele = document.createElement(obj.element);
	ele.setAttribute('class', obj.class);
	ele.setAttribute('id', obj.id);
	if( typeof(obj.source) !== "undefined" ) { ele.setAttribute('src', obj.source) };
	ele.textContent = obj.text;
	ele.onclick = obj.onclick;
	return ele;
}

let createHeader = () => {
	let header = webElement({element:'div', class: 'header'});
	header.append(
		webElement({element: 'div', class: 'header-text', textContent: 'Country'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Total Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'New Cases'})	
	);
	
	return header;
}

//Display data and run tests
displayData();

