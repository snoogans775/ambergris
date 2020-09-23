//Covid Data Tracker
//Kevin Fredericks 2020
//LICENSE: MIT
//Data sourced from:
// Covid Tracking Project 
// OECD GINI scores
// Transparency International

//Convert value to percent
function percent(value, total) {
	const result = Math.ceil( (value / total) * 100 );
	return result;
}

//Find max in dataset
function max(data, filter) {
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

//Calculate natural log of value
function naturalLog(value, multiplier = 1) {
	return ( Math.log(value) * multiplier ) + 0.5;
}

function fatality(countryObject) {
	//Return a decimal value of country fatality rate
	try {
		//percent() is an export in this file, dangerous
		let fatality = percent(countryObject.TotalDeaths, countryObject.TotalConfirmed);
		let result = Math.ceil(fatality);
		return result;
		
	} catch (err) {
		console.error(err);
	}
}

function bind(element) {
    switch(element.id) {
    case 'logSlider':
        element.noUiSlider.on('slide', function (values, handle) {
            var event = sliderMoveEvent(values[handle]);
            document.dispatchEvent(event);
        })
        document.addEventListener('slidermove', e => updateIndicators(e));
        break;
    case 'region-selector':
        element.addEventListener('change', e => dispatchRegionChange(e));
		break;
	case 'country-table':
		element.addEventListener('regionchange', e => filterTable(e));
    }
}

function dispatchRegionChange(event) {
	try {
		const table = document.querySelector('#country-table');
		//event.target.value is the selected region
		const regionChange = regionChangeEvent(event.target.value);
		table.dispatchEvent(regionChange);
	} catch(err) {
		console.error(
			`Dispatch Error: The table could not be found.\n
			The selector returned: ${table}`
		)
	}

}

function filterTable(event) {
	//Not a pure function, could be refactored to pass an
	//object to a newly rendered TableView
	try {
		const table = event.target;
		const elements = table.children;
		for( let element of elements ) {
			if (element === null) continue;
			if (element.className != 'entry') continue;

			const countryRegion = element.children[5].innerText;
			console.log(event.detail.region);
			if (event.detail.region == 'Global') {
				element.style.display = 'grid';
			} else if (countryRegion != event.detail.region) {
				element.style.display = 'None';
			} else {
				element.style.display = 'grid';
			}
		};
	} catch(err) {
		console.error(
			`Handler Error: The table could not be updated.\n
			The event handler returned ${table}.`
		)
	}
	

}

function updateIndicators(event) {
	let fatalityIndicators = document.querySelectorAll('.fatality-indicator');
	let casesBars = document.querySelectorAll('.totalCases-bar, .newCases-bar');

    try {
		//Update indicators
		for(let indicator of fatalityIndicators){
			updateFatality(indicator, event.detail.value);
		}
	} catch(err) {
		console.error(
			`Handler Error: The indicators could not be updated.\n
			The selectors returned: ${fatalityIndicators}`
		)
	}
	try {
		//Update bars
		for(let bar of casesBars){
			updateBar(bar, event.detail.value);
		}
	} catch(err) {
		console.error(
			`Handler Error: The bar elements could not be updated.\n
			The selectors returned: ${casesBars}`
		)
	}

}

function updateFatality(element, value) {
	const indicator = element;
	const multiplier = naturalLog(value, DAMPENER);
	const adjustedValue = naturalLog(indicator.value, multiplier);
	
	//Update indicator
	indicator.style.marginLeft = `${adjustedValue}%`;
}

function updateBar(element, value) {
	const bar = element;
	const multiplier = naturalLog(value, DAMPENER);
	const adjustedValue = naturalLog(bar.value, multiplier);
	
	//Update indicator
	bar.style.width = `${adjustedValue}%`;
}

//Custom event to update all indicators and bars
function sliderMoveEvent(value = 1) {
	const slidermove = new CustomEvent(
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

//Custom event to update all indicators and bars
function regionChangeEvent(region) {
	const regionChange = new CustomEvent(
		'regionchange',
		{
			detail: {
				region: region
			},
			bubbles: true,
			cancelable: true
		}
	);
	
	return regionChange;
}

//Requests made to server//
 const flags = async (countryCode) => {
	const response = await fetch('/flags');
	const data = await response.json();
	return data;
}

 const worldCovid = async () => {
	const response = await fetch('/world');
	const data = await response.json();
	return data;
}

 const usaCovid = async () => {
	const response = await fetch('/usa');
	const data = await response.json();
	return data;
}

 const gini = async () => {
	const response = await fetch('/gini');
	const data = await response.json();
	return data;
}

 const conversionMatrixJSON = async () => {
	const response = await fetch('/countryCodeMatrix');
	const data = await response.json();
	return data;
}

 const countryDetails = async () => {
	const response = await fetch('/countryDetails');
	const data = await response.json();
	return data;
}

 function tableView(data) {
    //Data constants
    const worldData = data['worldData'];
    const flagSources = data['flagSources'];
    const countryDetails = data['countryDetails'];
    
    //Create table
    const header = createHeader();
    const container = webElement({
        element: 'div', 
        class: 'entry-container',
        id: 'country-table'
    });
    container.append(header);

    // Create contents of current entry
    for (let item of worldData.Countries ) {
        const entry = webElement({
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
        let regionContainer = webElement({
            element: 'div',
            class: 'region-container'
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

    //Constants for use in calculation
    const MAX_TOTAL_CASES = max(worldData.Countries, c => c.TotalConfirmed);
    const MAX_NEW_CASES = max(worldData.Countries, c => c.NewConfirmed);

    //Style elements //
    
    //get source image for flag
    //Slight differences in naming convention of country code
    const flag = flagSources.filter( c => c.countryCode == item.CountryCode);
    if (flag) flagImg.src = flag[0].flagSource;
    
    //Convert total cases to a percentage of highest caseload country
    const totalCases = percent(item.TotalConfirmed, MAX_TOTAL_CASES);
    totalCasesBar.value = totalCases;
    totalCasesBar.style.width = `${totalCases}%`;
    
    //Convert total cases to a percentage of highest caseload country
    const newCases = percent(item.NewConfirmed, MAX_NEW_CASES);
    newCasesBar.value = newCases;
    newCasesBar.style.width = `${newCases}%`;
    
    //Show region
    const country = countryDetails.filter( c => c.alpha2Code == item.CountryCode);
    regionContainer.textContent = country[0].region;
    
    //Place fatality indicator
    const fatalityIndex = fatality(item);
    fatalityIndicator.value = fatalityIndex;
    fatalityIndicator.style.marginLeft = `${fatalityIndex}%`;

    //Construct the pretty bar graphs
    totalCasesContainer.appendChild(totalCasesBar);
    newCasesContainer.appendChild(newCasesBar);
    fatalityContainer.appendChild(fatalityIndicator);
    
    //Construct the entry
    entry.append(
        flagImg, 
        countryName, 
        totalCasesContainer,
        newCasesContainer,
        fatalityContainer,
        regionContainer
    );
    container.append(entry);
    }
    bind(container);

    return container;
}

function createHeader(fields = null) {
	const header = webElement({element:'div', class: 'header'});
	header.append(
		webElement({element: 'div', class: 'header-text', textContent: 'Country'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Total Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'New Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Fatality'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Region'})
	);
	
	return header;
}

 function header(context) {
    //'public' is the only context 08-16-2020
    const container = webElement({
        element: 'div',
        class: 'page-header'
    });
    const head = webElement({
        element: 'h1', 
        textContent: 'Ambergris'
    });
    const subtitle = webElement({
        element: 'p', 
        textContent: 'Covid-19 Data Tracker'
    });

    container.appendChild(head);
    container.appendChild(subtitle);

    return container;
}

function createUI(data) {
    //Find the data we need from the bundle
    let countryDetails = null;
    try {
        countryDetails = data.countryDetails;
    } catch(err) {
        console.error(err);
    }

	let uiContainer = webElement({element: 'div', id: 'ui-container'});
    //Create region selector
    let regionWidget = regionSelector(countryDetails);
    //Create logarithmic slider
    let logSlider = logarithmicSlider();

	//Put it all together
    uiContainer.appendChild(regionWidget);
    uiContainer.appendChild(logSlider);

	//Bind event handlers
    bind(regionWidget);
    bind(logSlider);

	return uiContainer;
}

function logarithmicSlider() {
    let container = webElement({
        element: 'div',
        class: 'ui-element'
    });

	let sliderLabel = webElement({
		element: 'div', 
		class: 'ui-element',
		textContent: 'Expand Values'
    });
    //Create slider to multiply values
	let logSlider = webElement({element: 'div',id: 'logSlider'});
	//Configure slider
	noUiSlider.create(logSlider, {
		start: [1],
		connect: true,
		range: {
			'min': 1,
			'max': 50
		}
    });

    //Bind event handler
    bind(logSlider);

    //Put it all together
    container.appendChild(sliderLabel);
    container.appendChild(logSlider);

    return container;
}

function regionSelector(data) {
    //The data is the countryData object
    let container = webElement({
        element: 'div',
        class: 'ui-element'
    });

	let regionLabel = webElement({
		element: 'div', 
		id: 'region-selector-label',
		textContent: 'Region'
    });
    
	let selector = webElement({
        element: 'select', 
        id: 'region-selector'
    });

	let regions = [...new Set(data.map( c => c.region ))];
	regions.map(region => {
        let option = {};
        if( region != '') {
            option =  webElement({
                element: 'option',
                value: region,
                textContent: region
            });
        }
        else {
            option =  webElement({
                element: 'option',
                value: 'Global',
                textContent: 'Global'
            });
        }
        //Replace blank region with 'Global'
        
		selector.appendChild(option);
    });

    //Bind event handler
    bind(selector);

    //Put it all together
    container.appendChild(regionLabel);
    container.appendChild(selector);

    return container;
}

function webElement(obj) {
	//Create new element
	const ele = document.createElement(obj.element);
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

const display = async () => {
	//Fetching data from API
	//This syntax only works within an async scope
	const dataBundle = {
		worldData: await worldCovid(), 
		flagSources: await flags(), 
		countryDetails: await countryDetails(), 
		countryCodeMatrix: await conversionMatrixJSON()
	};
	
	//Render title
	const head = header('public');

	//Create UI
	const ui = createUI(dataBundle);

	//Create table
	const table = tableView(dataBundle);

	//Put everything together
	const root = document.querySelector('#root');
	root.append(head);
	root.append(ui);
	root.append(table);
}

//Display data using async function
display();