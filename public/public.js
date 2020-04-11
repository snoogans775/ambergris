const displayData = async () => {
	let dataset = await getCovidJSON();
	let recentData = dataset[0].data.rows;
	console.log(recentData);
	
	//Create chart
	let header = createHeader();
	let container = newElement({
		element: 'div', 
		class: 'container'
	});
	
	//Global numbers for computations
	let worldCases = toNum(recentData[0].total_cases);
	
	//Insert rows
	for ( item of recentData ) {
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
			text: item.cases_per_mill_pop
		});
		let bar = newElement({
			element: 'span',
			class: 'cases-bar',
		});
		//FIXME: Refactor newElement styling (Kevin: 5/11/2020 11:52:00)
		let casesPerMill = toNum(item.cases_per_mill_pop);
		let width = toPercent(casesPerMill, worldCases);
		bar.style.width = `${width}%`;
		
		container.append(flag, countryName, bar);
	}
	
	let root = document.querySelector('#root');
	root.append(header);
	root.append(container);
}

//Computation functions
const toNum = (str) => {
	let result = parseInt(str.replace(',', ''));
	return result;
}

const toPercent = (value, total) => {
	let result = Math.floor((value / total) * 100);
	return result;
}

//Requests made to server
const getCovidJSON = async () => {
	const response = await fetch('/covid');
	const data = await response.json();
	return data;
}

// Element functions
var newElement = (obj) => {
	let ele = document.createElement(obj.element);
	ele.setAttribute('class', obj.class);
	if(typeof(obj.source) !== "undefined") {ele.setAttribute('src', obj.source)};
	ele.textContent = obj.text;
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

displayData();

