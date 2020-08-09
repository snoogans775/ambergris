import * as Compute from './compute.js';

//Event Handlers and Listeners
export function bind(element) {
    switch(element.id) {
    case 'logSlider':
        element.noUiSlider.on('slide', function (values, handle) {
            var event = sliderMoveEvent(values[handle]);
            document.dispatchEvent(event);
        })
        document.addEventListener('slidermove', (e) => updateIndicators(e));
    break;
    }
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
	const DAMPENER = 5; //Higher values dampen the effect
	let indicator = element;
	let multiplier = Compute.naturalLog(value, DAMPENER);
	let adjustedValue = Compute.naturalLog(indicator.value, multiplier);
	
	//Update indicator
	indicator.style.marginLeft = `${adjustedValue}%`;
}

function updateBar(element, value) {
	const DAMPENER = 5; //Higher values dampen the effect
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