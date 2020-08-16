import WebElement from './WebElement.js';

export default function Header(context) {
    //'public' is the only context 08-16-2020
    let container = WebElement({
        element: 'div',
        class: 'page-header'
    });
    let head = WebElement({
        element: 'h1', 
        textContent: 'Ambergris'
    });
    let subtitle = WebElement({
        element: 'p', 
        textContent: 'Covid-19 Data Tracker'
    });

    container.appendChild(head, subtitle);

    return container;

}