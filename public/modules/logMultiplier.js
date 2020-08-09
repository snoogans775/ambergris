class logMultiplier {
    constructor(name, element) {
        this.name = name;
        this.element = element;
    }

    createLogMultiplier {
        let logMultiplierContainer = webElement({
            element: 'div',
            class: 'log-multiplier-container',
            id: 'log-multiplier-container' 
        })
        let logMultiplierIndicator = webElement({
            element: 'div',
            class: 'generic-indicator',
            id: 'log-multiplier-indicator',
        })
        
        logMultiplierContainer.appendChild(logMultiplierIndicator);
        
        return logMultiplierContainer;
    }
    //Event Handlers and Listeners
let assignEventListeners = () => {
	console.log(isMouseDown);
	let multiplier = document.querySelector('#log-multiplier-container');
	let multiplierIndicator = document.querySelector('#log-multiplier-indicator');

	//Create unique attribute for width of slider
	multiplierIndicator.absoluteWidth = multiplierIndicator.clientWidth;

	//Control focus on slider
	multiplierIndicator.addEventListener('mousedown', focusSlider);
	multiplier.addEventListener('mouseup', removeFocusSlider);
	multiplier.addEventListener('mouseout', removeFocusSlider);

	//Move slider indicator
	multiplier.addEventListener('mousemove', moveIndicator);
	
	//Eventlisteners for all indicators
	let fatalityIndicators = document.querySelectorAll('.fatality-indicator');
	for(let indicator of fatalityIndicators) {
		indicator.addEventListener('slidermove', updateFatality);
	}
	//Eventlisteners for all bars
	let allBars = document.querySelectorAll('.totalCases-bar', '.newCases-bar');
	for(let bar of allBars) {
		bar.addEventListener('slidermove', updateBar);
	}
}

    focusSlider(event) {
        let indicator = document.querySelector('#log-multiplier-indicator');
        setPosition(indicator, event.offsetX);
        isMouseDown = true;
    }

    removeFocusSlider(event) {
        isMouseDown = false;
        console.log(isMouseDown);
    }

    moveIndicator(event) {
        console.log(isMouseDown);
        if (isMouseDown) {
            //Define slider from DOM
            let container = document.querySelector('#log-multiplier-container');
            let indicator = document.querySelector('#log-multiplier-indicator');
            let offset = event.offsetX - indicator.absoluteWidth/2;
            
            //Update slider position
            let upperBound = container.clientWidth;
            //Check for right edge and move
            let newPosition = (offset <= upperBound) ? `${offset}px` : `${upperBound}px`;
            setPosition(indicator, newPosition);
            
            let slidermove = sliderMoveEvent(offset);
            updateIndicatorsAll(slidermove);
        }

    }

    setPosition(indicator, leftOffset) {
        //Check for right edge and move
        indicator.style.paddingLeft = leftOffset;
    }
}

/* TO BE REFACTORED TO CLASS
	let multiplier = document.querySelector('#log-multiplier-container');
	let multiplierIndicator = document.querySelector('#log-multiplier-indicator');

	//Create unique attribute for width of slider
	multiplierIndicator.absoluteWidth = multiplierIndicator.clientWidth;

	//Control focus on slider
	multiplierIndicator.addEventListener('mousedown', focusSlider);
	multiplier.addEventListener('mouseup', removeFocusSlider);
	multiplier.addEventListener('mouseout', removeFocusSlider);

	//Move slider indicator
    multiplier.addEventListener('mousemove', moveIndicator);

    //Custom event to update all indicators and bars
let sliderMoveEvent = (value = 1) => {
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
    */