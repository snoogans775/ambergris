import WebElement from './modules/WebElement.js';
import * as Get from './modules/Requests.js';

const display = async () => {
    const dataset = await Get.worldCovid();
    console.log(dataset);

    // Show chart of covid data
    let subset = dataset.Countries;

    d3.select('#content')
        .selectAll('tr')
        .data(subset)
        .enter().append('tr')
        .html( (d) => {
            return '<th scope="row">' + d.CountryCode +
                '</th>'
        })

}

// Add dummy data to to the navbar
let pages = ['Explore', 'Global', 'United States'];

// Add values to navbar
var navbar = d3.select('#navbar')
    .selectAll('div')
    .data(pages);

navbar.enter()
    .append('div')
    .merge(navbar)
    .text( d => {return d;});

    display();