//import * as d3 from "./modules/d3.min.js"
import WebElement from "./modules/WebElement.js";

let svgContainer = new WebElement({
    element: 'svg',
    width: "500",
    height: "500"
});

let rect = new WebElement({
    element: "rect",
    x: "0",
    y: "0",
    fill: "yellow"
});

const root = document.querySelector('#root');
svgContainer.appendChild(rect);
root.append(svgContainer);

console.log(d3);