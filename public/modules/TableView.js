import webElement from './webelement.js';
import * as Compute from './compute.js';

export default function TableView(data) {
    //Data constants
    const worldData = data['worldData'];
    const flagSources = data['flagSources'];
    const countryDetails = data['countryDetails'];
    const countryCodeMatrix = data['countryCodeMatrix'];
    
    //Create table
    let header = createHeader();
    let container = webElement({
        element: 'div', 
        class: 'entry-container',
        id: 'country-table'
    });
    container.append(header);

    // Create contents of current entry
    for (let item of worldData.Countries ) {
        let entry = webElement({
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
        let wealthContainer = webElement({
            element: 'div',
            class: 'wealth-container'
        })
        let wealthIndicator = webElement({
            element: 'div',
            class: 'generic-indicator'
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
    const MAX_TOTAL_CASES = Compute.max(worldData.Countries, c => c.TotalConfirmed);
    const MAX_NEW_CASES = Compute.max(worldData.Countries, c => c.NewConfirmed);

    //Style elements //
    
    //Get source image for flag
    //Slight differences in naming convention of country code
    let flag = flagSources.filter( c => c.countryCode == item.CountryCode);
    if (flag) flagImg.src = flag[0].flagSource;
    
    //Convert total cases to a percentage of highest caseload country
    let totalCases = Compute.percent(item.TotalConfirmed, MAX_TOTAL_CASES);
    totalCasesBar.value = totalCases;
    totalCasesBar.style.width = `${totalCases}%`;
    
    //Convert total cases to a percentage of highest caseload country
    let newCases = Compute.percent(item.NewConfirmed, MAX_NEW_CASES);
    newCasesBar.value = newCases;
    newCasesBar.style.width = `${newCases}%`;
    
    //Place wealth disparity indicator according to GINI score
    let giniScore = Compute.GINI(item.CountryCode, countryDetails, countryCodeMatrix);
    wealthIndicator.style.marginLeft = `${giniScore}%`;
    
    //Place fatality indicator
    let fatality = Compute.fatality(item);
    fatalityIndicator.value = fatality;
    fatalityIndicator.style.marginLeft = `${fatality}%`;

    //Construct the pretty bar graphs
    totalCasesContainer.appendChild(totalCasesBar);
    newCasesContainer.appendChild(newCasesBar);
    fatalityContainer.appendChild(fatalityIndicator);
    wealthContainer.appendChild(wealthIndicator);
    
    //Construct the entry
    entry.append(
        flagImg, 
        countryName, 
        totalCasesContainer,
        newCasesContainer,
        fatalityContainer,
        wealthContainer
    );
    container.append(entry);
    }

    return container;
}

function createHeader(fields = null) {
	let header = webElement({element:'div', class: 'header'});
	header.append(
		webElement({element: 'div', class: 'header-text', textContent: 'Country'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Total Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'New Cases'}),
		webElement({element: 'div', class: 'header-text', textContent: 'Fatality'}),
		webElement({element: 'div', class: 'header-text', textContent: 'GINI'})
	);
	
	return header;
}

export function applyStyles(styleBundle) {
}