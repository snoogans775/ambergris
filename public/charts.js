import WebElement from "./modules/WebElement.js";

let svgContainer = new WebElement({
    element: 'svg',
    width: "500",
    height: "500"
});

let rect = new WebElement({
    element: "rect",
    x: "500",
    y: "0",
    width: "300",
    height: "200",
    fill: "red"
});

let test = new WebElement({
    element: "div",
    class: "testy"
});

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

//Add the svg to the root element
svgContainer.appendChild(rect);

d3.select('#content').append(test);