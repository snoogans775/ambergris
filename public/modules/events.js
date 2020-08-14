import * as Compute from './compute.js';
import * as Get from './requests.js';

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
	let table = document.querySelector('#country-table');
	let regionChange = regionChangeEvent(event.region);
	table.dispatchEvent(regionChange);

}

function filterTable(event) {
	let table = event.target;
	let entries = table.children;
	console.log(entries);
	for( let entry of entries ) {
		if (entry.class == '') break;
		if (entry.class == 'entry') {
			let element = document.querySelector(entry.id);
			element.style.display = 'none';
		}
	};
	

}

function updateIndicators(event) {
    
	//Update indicators
	let fatalityIndicators = document.querySelectorAll('.fatality-indicator');
	for(let indicator of fatalityIndicators){
		updateFatality(indicator, event.detail.value);
	}
	//Update bars
	let totalCasesBars = document.querySelectorAll('.totalCases-bar, .newCases-bar');
	for(let bar of totalCasesBars){
		updateBar(bar, event.detail.value);
	}
}

function updateFatality(element, value) {
	let indicator = element;
	let multiplier = Compute.naturalLog(value, DAMPENER);
	let adjustedValue = Compute.naturalLog(indicator.value, multiplier);
	
	//Update indicator
	indicator.style.marginLeft = `${adjustedValue}%`;
}

function updateBar(element, value) {
	let bar = element;
	let multiplier = Compute.naturalLog(value, DAMPENER);
	let adjustedValue = Compute.naturalLog(bar.value, multiplier);
	
	//Update indicator
	bar.style.width = `${adjustedValue}%`;
}

//Custom event to update all indicators and bars
function sliderMoveEvent(value = 1) {
	let slidermove = new CustomEvent(
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
function regionChangeEvent(region = null) {
	let regionChange = new CustomEvent(
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