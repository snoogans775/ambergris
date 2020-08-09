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
        element.addEventListener('change', e => filterTable(e));
        break;
    }
}

function filterCountries(e) {
    let table = document.querySelector('#country-table');
    //We perform another get request so that we have the country data in this
    //module. The country data should ideally be sent to the event handler.
    let countryData = Get.countryDetails();
    let filtered = countryData.map(c => c.region === e.target.value);
    console.log(filtered);

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