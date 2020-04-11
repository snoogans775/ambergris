const displayData = async () => {
	let data = await getCovidJSON();
	
	let container = newElement('div', 'container',)
	
	for ( item of data ) {
		let entry = newElement('div', 'entry');
		let countryName = newElement('div', 'country-name', item.country);
		let casesPerMil = newElement('div', 'text', item.case_per_mill_pop);
		let flag = newElement('img', 'flag');
		flag.setAttribute('src', item.flag);
		
		let progressBar = newElementObject({
			element: 'div',
			class: 'progress-bar'
		}
		);
		progressBar.style.width = 100;

		entry.append(flag, countryName, casesPerMil, progressBar);
		container.append(entry);
	}
	
	document.body.append(container);
}

//Requests made to server
const getCovidJSON = async () => {
	const response = await fetch('/covid');
	const data = await response.json();
	return data;
}

// Element functions
const newElement = (html, cl, text) => {
	let ele = document.createElement(html);
	ele.setAttribute('class', cl);
	ele.textContent = text;
	return ele;
}

const newElementObject = (obj) => {
	let ele = document.createElement(obj.element);
	ele.setAttribute('src', obj.source);
	ele.setAttribute('class', obj.class);
	ele.textContent = obj.text;
	return ele;
}

displayData();

