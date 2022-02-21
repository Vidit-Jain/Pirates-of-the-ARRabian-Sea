import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// function Base() {
//     let base;
// 	const geometry = new THREE.BoxGeometry(5, 1, 8);
// 	const texture = new THREE.TextureLoader().load('./textures/wood.jpeg');
// 	const material = new THREE.MeshBasicMaterial({map: texture});
// 	base = new THREE.Mesh(geometry, material);
//     return base;
// }
// function Side() {
//     let side;
// 	const geometry = new THREE.BoxGeometry(1, 1, 8);
// 	const texture = new THREE.TextureLoader().load('./textures/wood.jpeg');
// 	const material = new THREE.MeshBasicMaterial({map: texture});
// 	side = new THREE.Mesh(geometry, material);
//     return side;
// }
// function 
// export function Ship() {
    	
// 	let ship = new THREE.Group();
//     let cube, cube2;
// 	// Init BoxGeometry object (rectangular cuboid)

// 	// Add to scene
// 	// cube2.position.y = 5;
//     let base = Base();
//     let sideLeft = Side();
//     let sideRight = Side();
//     sideLeft.position.x = -2.5;
//     sideLeft.position.y = 1; 
//     sideRight.position.x = 2.5;
//     sideRight.position.y = 1; 
//     ship.add(sideLeft);
//     ship.add(sideRight);
// 	ship.add(base);
// 	// a.add(cube2);
//     return ship;
// };
export class Ship{
    constructor(scene){
        // this.dist = 0;
        // this.score = 0;
        // this.health = 100;
        // this.time = 50;
        // this.VELOCITY = 1;
        this.initRenderData(scene);
    }
    
    initRenderData(scene){
        var loader = new GLTFLoader();
        loader.load("./models/ship_light.glb", (obj) => {
            obj.scene.scale.set(0.1,0.1,0.1);
            obj.scene.rotation.y += Math.PI;
            obj.scene.position.z = -5;
            this.obj = obj.scene;
            scene.add(obj.scene);
        });
    }
}