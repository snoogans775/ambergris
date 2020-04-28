const displayData = async () => {
	let dataset = await getWorldJSON();
	let recentData = dataset;
	console.log(recentData);
	
	const maxCases = getMaxCases(recentData.Countries);
	
	//Create chart
	let header = createHeader();
	let container = newElement({
		element: 'div', 
		class: 'container'
	});
	
	//Global numbers for computations
	let worldCases = recentData.Global.TotalConfirmed;
	
	//Insert rows
	for ( item of recentData.Countries ) {
		let entry = newElement({
			element: 'div', 
			class: 'entry'
		});
		let flag = newElement({
			element: 'img', 
			class: 'flag', 
			source: item.Country
		});
		let countryName = newElement({
			element: 'div', 
			class: 'country-name', 
			text: item.Country
		});
		let cases = newElement({
			element: 'div',
			class: 'text', 
			text: item.TotalConfirmed
		});
		let bar = newElement({
			element: 'span',
			class: 'cases-bar'
		});
		//FIXME: Refactor newElement styling (Kevin: 5/11/2020 11:52:00)
		let localCases = item.TotalConfirmed;
		let width = (localCases / worldCases) * 1000;
		bar.style.width = `${width}%`;
		bar.id = `${item.Country.toLowerCase()}-bar`;
		
		//text overlay
		bar.append(localCases);
		
		entry.append(flag, countryName, bar);
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
var newElement = (obj) => {
	let ele = document.createElement(obj.element);
	ele.setAttribute('class', obj.class);
	if(typeof(obj.source) !== "undefined") {ele.setAttribute('src', obj.source)};
	ele.textContent = obj.text;
	ele.onclick = obj.onclick;
	return ele;
}

var createHeader = () => {
	let header = newElement({element:'div', class: 'header'});
	header.append(
		newElement({element: 'div', text: 'Country'}),
		newElement({element: 'div', text: 'Cases'})	
	);
	
	return header;
}

displayData();

