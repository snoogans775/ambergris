const displayData = async () => {
	//Fetching data from API
	let worldData = await getWorldJSON();
	let recentUsaData   = await getUsaJSON();
	console.log(worldData);
	console.log('USA DATA');
	console.log(recentUsaData);
	
	//Constants for use in calculation
	const worldCases = worldData.Global.TotalConfirmed;
	
	//Create chart
	let header = createHeader();
	let container = webElement({
		element: 'div', 
		class: 'container'
	});
	
	//Insert rows
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
		let cases = webElement({
			element: 'div',
			class: 'text', 
			text: item.TotalConfirmed
		});
		let barContainer = webElement({
			element: 'div',
			class: 'cases-barContainer',
		})
		let bar = webElement({
			element: 'div',
			class: 'cases-bar'
		});
		
		//Convert total cases to a percentage of world cases
		let localCases = item.TotalConfirmed;
		let width = ( localCases / worldCases ) * 100;
		bar.style.width = `${width}%`;
		
		//Local cases bar is a child of total cases container
		barContainer.appendChild(bar);
		
		//Fetch the image for the country flag
		
		
		entry.append(flag, countryName, barContainer);
		container.append(entry);
	}
	
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

let getMaxCases = (data) => {
	let result = data.map( item => item.TotalConfirmed );
	let maxValue = result.reduce( (a,b) => {
		return Math.max(a,b);
	})
	console.log( maxValue );
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
		webElement({element: 'div', class: 'header-text', text: 'Cases'})	
	);
	
	return header;
}

//Display data and run tests
displayData();
//console.log(getWealthJSON);

