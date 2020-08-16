import * as EventHandler from './events.js';
import WebElement from './WebElement.js';

export default function ui(data) {
    //Find the data we need from the bundle
    let countryDetails = null;
    try {
        countryDetails = data.countryDetails;
    } catch(err) {
        console.error(err);
    }

	let uiContainer = WebElement({element: 'div', id: 'ui-container'});
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
    let container = WebElement({
        element: 'div',
        class: 'ui-element'
    });

	let sliderLabel = WebElement({
		element: 'div', 
		class: 'ui-element',
		textContent: 'Expand Values'
    });
    //Create slider to multiply values
	let logSlider = WebElement({element: 'div',id: 'logSlider'});
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
    //The data is the countryData object
    let container = WebElement({
        element: 'div',
        class: 'ui-element'
    });

	let regionLabel = WebElement({
		element: 'div', 
		id: 'region-selector-label',
		textContent: 'Region'
    });
    
	let selector = WebElement({
        element: 'select', 
        id: 'region-selector'
    });

	let regions = [...new Set(data.map( c => c.region ))];
	regions.map(region => {
        let option = {};
        if( region != '') {
            option =  WebElement({
                element: 'option',
                value: region,
                textContent: region
            });
        }
        else {
            option =  WebElement({
                element: 'option',
                value: 'Global',
                textContent: 'Global'
            });
        }
        //Replace blank region with 'Global'
        
		selector.appendChild(option);
    });

    //Bind event handler
    EventHandler.bind(selector);

    //Put it all together
    container.appendChild(regionLabel);
    container.appendChild(selector);

    return container;
}