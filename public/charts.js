import WebElement from './modules/WebElement.js';
import * as Get from './modules/Requests.js';

const worldCovid = async () => {
    return await Get.worldCovid();
}

const data = worldCovid();

//Add dummy data to to the navbar
let pages = ['Explore', 'Global', 'United States'];

//Add values to navbar
var navbar = d3.select('#navbar')
    .selectAll('div')
    .data(pages);

navbar.enter()
    .append('div')
    .merge(navbar)
    .text( d => {return d;});