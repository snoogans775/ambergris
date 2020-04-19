const displayData = async () => {
	let dataset = await getWorldJSON();
	let recentData = dataset[0].data.rows;
	console.log(recentData);
	
	getAllCasesPerCapita(recentData);
	
	//Create chart
	let header = createHeader();
	let container = newElement({
		element: 'div', 
		class: 'container'
	});
	
	//Global numbers for computations
	let worldCases = toNum(recentData[0].cases_per_mill_pop);
	
	//Insert rows
	for ( item of recentData ) {
		let entry = newElement({
			element: 'div', 
			class: 'entry'
		});
		let flag = newElement({
			element: 'img', 
			class: 'flag', 
			source: item.flag
		});
		let countryName = newElement({
			element: 'div', 
			class: 'country-name', 
			text: item.country,
		});
		let cases = newElement({
			element: 'div',
			class: 'text', 
			text: item.total_cases
		});
		let bar = newElement({
			element: 'span',
			class: 'cases-bar',
		});
		//FIXME: Refactor newElement styling (Kevin: 5/11/2020 11:52:00)
		let localCases = toNum(item.cases_per_mill_pop);
		let width = toPercent(localCases, worldCases);
		bar.style.width = `${width}%`;
		bar.id = `${item.country.toLowerCase()}-bar`;
		
		//text overlay
		bar.append(cases);
		
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

let getAllCasesPerCapita = (data) => {
	let item = data[0].cases.per_mill_pop;
	console.log( item );
}

//Requests made to server
const getWorldJSON = async () => {
	const response = await fetch('/world');
	const data = await response.json();
	return data;
}

const getWealthCSV = async () => {
	const response = await fetch('/oecd');
	const data = await response.json();
	console.log(data);
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
		newElement({element: 'div', text: 'Cases Per Capita'})	
	);
	
	return header;
}

getWealthCSV();
displayData();

