import WebElement from './WebElement.js';
import * as EventHandler from './Events.js';
import * as Compute from './Compute.js';

export default function TableView(data) {
    //Data constants
    const worldData = data['worldData'];
    const flagSources = data['flagSources'];
    const countryDetails = data['countryDetails'];
    
    //Create table
    const header = createHeader();
    const container = WebElement({
        element: 'div', 
        class: 'entry-container',
        id: 'country-table'
    });
    container.append(header);

    // Create contents of current entry
    for (let item of worldData.Countries ) {
        const entry = WebElement({
            element: 'div', 
            class: 'entry',
            id: `${item.CountryCode}-entry`
        });
        let flagImg = WebElement({
            element: 'img', 
            class: 'flag', 
        });
        let countryName = WebElement({
            element: 'div', 
            class: 'country-name', 
            textContent: item.Country
        });
        let totalCasesContainer = WebElement({
            element: 'div',
            class: 'totalCases-barContainer',
        })
        let totalCasesBar = WebElement({
            element: 'div',
            class: 'totalCases-bar',
            id: `${item.CountryCode}-total-cases-bar`
        });
        let newCasesContainer = WebElement({
            element: 'div',
            class: 'newCases-barContainer',
        })
        let newCasesBar = WebElement({
            element: 'div',
            class: 'newCases-bar',
            id: `${item.CountryCode}-new-cases-bar`
        });
        let regionContainer = WebElement({
            element: 'div',
            class: 'region-container'
        })
        let fatalityContainer = WebElement({
            element: 'div',
            class: 'fatality-container'
        })
        let fatalityIndicator = WebElement({
            element: 'div',
            class: 'fatality-indicator',
            id: `${item.CountryCode}-fatality-indicator`
        })

    //Constants for use in calculation
    const MAX_TOTAL_CASES = Compute.max(worldData.Countries, c => c.TotalConfirmed);
    const MAX_NEW_CASES = Compute.max(worldData.Countries, c => c.NewConfirmed);

    //Style elements //
    
    //Get source image for flag
    //Slight differences in naming convention of country code
    const flag = flagSources.filter( c => c.countryCode == item.CountryCode);
    if (flag) flagImg.src = flag[0].flagSource;
    
    //Convert total cases to a percentage of highest caseload country
    const totalCases = Compute.percent(item.TotalConfirmed, MAX_TOTAL_CASES);
    totalCasesBar.value = totalCases;
    totalCasesBar.style.width = `${totalCases}%`;
    
    //Convert total cases to a percentage of highest caseload country
    const newCases = Compute.percent(item.NewConfirmed, MAX_NEW_CASES);
    newCasesBar.value = newCases;
    newCasesBar.style.width = `${newCases}%`;
    
    //Show region
    const country = countryDetails.filter( c => c.alpha2Code == item.CountryCode);
    regionContainer.textContent = country[0].region;
    
    //Place fatality indicator
    const fatality = Compute.fatality(item);
    fatalityIndicator.value = fatality;
    fatalityIndicator.style.marginLeft = `${fatality}%`;

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
    EventHandler.bind(container);

    return container;
}

function createHeader(fields = null) {
	const header = WebElement({element:'div', class: 'header'});
	header.append(
		WebElement({element: 'div', class: 'header-text', textContent: 'Country'}),
		WebElement({element: 'div', class: 'header-text', textContent: 'Total Cases'}),
		WebElement({element: 'div', class: 'header-text', textContent: 'New Cases'}),
		WebElement({element: 'div', class: 'header-text', textContent: 'Fatality'}),
		WebElement({element: 'div', class: 'header-text', textContent: 'Region'})
	);
	
	return header;
}

//A possible refactor for the styling methods
export function applyStyles(styleBundle) {
}