import * as EventHandler from './events.js';
import webElement from './webelement.js';

export default function ui(data) {
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
    EventHandler.bind(regionWidget);
    EventHandler.bind(logSlider);

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
    EventHandler.bind(logSlider);

    //Put it all together
    container.appendChild(sliderLabel);
    container.appendChild(logSlider);

    return container;
}

function regionSelector(data) {
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
		let option =  webElement({
			element: 'option',
			value: region,
			textContent: region
		});
		selector.appendChild(option);
    });

    //Bind event handler
    EventHandler.bind(selector);

    //Put it all together
    container.appendChild(regionLabel);
    container.appendChild(selector);

    return container;
}