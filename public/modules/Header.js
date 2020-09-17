import WebElement from './WebElement.js';

export default function Header(context) {
    //'public' is the only context 08-16-2020
    const container = WebElement({
        element: 'div',
        class: 'page-header'
    });
    const head = WebElement({
        element: 'h1', 
        textContent: 'Ambergris'
    });
    const subtitle = WebElement({
        element: 'p', 
        textContent: 'Covid-19 Data Tracker'
    });

    container.appendChild(head);
    container.appendChild(subtitle);

    return container;

}