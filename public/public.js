const displayData = async () => {
	//Fetching data from API
	let worldData = await getWorldJSON();
	console.log(worldData);
	
	//Constants for use in calculation
	const MAX_TOTAL_CASES = getMax(worldData.Countries, country => country.TotalConfirmed);
	const MAX_NEW_CASES = getMaxNewCases(worldData);
	
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
			class: 'entry'
		});
		let flag = webElement({
			element: 'img', 
			class: 'flag', 
			source: 'flags/' + item.CountryCode + '.png'
		});
		let countryName = webElement({
			element: 'div', 
			class: 'country-name', 
			text: item.Country
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
let toNum = (str) => {
	try {
		let result = parseInt(str.replace(',', ''));
		return result;
	} catch (err) {
		console.log(err);
	}
}

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

//Requests made to server
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

// Element functions
var webElement = (obj) => {
	let ele = document.createElement(obj.element);
	ele.setAttribute('class', obj.class);
	if( typeof(obj.source) !== "undefined" ) { ele.setAttribute('src', obj.source) };
	ele.textContent = obj.text;
	ele.onclick = obj.onclick;
	return ele;
}

var createHeader = () => {
	let header = webElement({element:'div', class: 'header'});
	header.append(
		webElement({element: 'div', class: 'header-text', text: 'Country'}),
		webElement({element: 'div', class: 'header-text', text: 'Total Cases'}),
		webElement({element: 'div', class: 'header-text', text: 'New Cases'})	
	);
	
	return header;
}

//Display data and run tests
displayData();

