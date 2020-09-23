import * as Compute from './Compute.js';

const DAMPENER = 5; //Used for naturalLog computation

//Event Handlers and Listeners
export function bind(element) {
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
    try {
		//Update indicators
		const fatalityIndicators = document.querySelectorAll('.fatality-indicator');
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
		const casesBars = document.querySelectorAll('.totalCases-bar, .newCases-bar');
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
	const multiplier = Compute.naturalLog(value, DAMPENER);
	const adjustedValue = Compute.naturalLog(indicator.value, multiplier);
	
	//Update indicator
	indicator.style.marginLeft = `${adjustedValue}%`;
}

function updateBar(element, value) {
	const bar = element;
	const multiplier = Compute.naturalLog(value, DAMPENER);
	const adjustedValue = Compute.naturalLog(bar.value, multiplier);
	
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