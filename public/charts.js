import WebElement from "./modules/WebElement.js";
import * as THREE from './modules/three/build/three.module.js';

var camera, scene, light, renderer;
var geometry, material, earthMesh;
 
init();
draw();
 
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.z = 1.5;
    light = new THREE.AmbientLight(0x888888)
    scene.add(light);
    light = new THREE.DirectionalLight( 'white', 1)
    light.position.set(5,5,5)
    light.target.position.set( 0,0,0 );
    scene.add(light);

    // Create mesh for earth texture
    earthMesh = THREE

    geometry = new THREE.SphereGeometry(0.5, 32, 32);
    material = new THREE.MeshPhongMaterial();
    earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);

    material.map = THREE.ImageUtils.loadTexture('img/earthmap1k.jpg');

 
}
 
function draw() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

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