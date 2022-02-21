import * as THREE from "three"
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Ship} from "./Ship.js"
import {Chest} from "./Chest.js"
let camera, scene, renderer, cube, cube2, ship, chest, line, damn = null;
let moveForward = false, moveBackward = false, moveRight = false, moveLeft = false;
let CameraView = new THREE.Vector3(0, 2, 5);
let Yaxis = new THREE.Vector3(0, 1, 0);
let rotateSpeed = 1;
let moveSpeed = 5;
let clock = new THREE.Clock();
let properY = -0.4;
let properYChest = -0.1;
let shipBox = [[100, -100], [100, -100], [100, -100]];
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function collision(a, b) {
	var box1 = new THREE.Box3().setFromObject(a);
	var box2 = new THREE.Box3().setFromObject(b);
	return box1.intersectsBox(box2);
}
function init() {
	// Init scene
	scene = new THREE.Scene();

	// Init camera (PerspectiveCamera)
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	// Init renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });

	// Set size (whole window)
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Render to canvas element
	document.body.appendChild(renderer.domElement);
	
	// a = new THREE.Group();
	// // Init BoxGeometry object (rectangular cuboid)
	const geometry = new THREE.BoxGeometry(1000, 0.2, 1000);
	// const geometry2 = new THREE.BoxGeometry(1, 1, 2);

	// const material2 = new THREE.MeshBasicMaterial({color: 0xffffff});
	// // Create material with color
	// const texture = new THREE.TextureLoader().load('./textures/wood.jpeg');
	// const material = new THREE.MeshBasicMaterial({map: texture});

	
	// // Add texture - 
	const texture = new THREE.TextureLoader().load('textures/water.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 100, 100 );

	// // Create material with texture
	const material = new THREE.MeshBasicMaterial({ map: texture });

	// // Create mesh with geo and material
	cube = new THREE.Mesh(geometry, material);
	cube.position.y = 0;
	// cube2 = new THREE.Mesh(geometry2, material2);

	// // Add to scene
	// cube2.position.y = 5;
	// a.add(cube);
	// a.add(cube2);
	ship = new Ship(scene);
	console.log(ship);
	console.log(ship.obj);
	const material3 = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	const points = [];
	// ship.obj.updateMatrixWorld();
	// points.push( new THREE.Vector3( - 10, 3, 0 ) )
	points.push(new THREE.Vector3(-5, 3, 0));
	points.push(new THREE.Vector3(5, 3, 0));
	// points.push( new THREE.Vector3( 10, 3, 0 ) )
	const geometry3 = new THREE.BufferGeometry().setFromPoints( points );
	line = new THREE.Line( geometry3, material3 );
	scene.add(line);
	// ship.obj.box = "hi";
	// ship.obj = {...ship.obj, box: "hi"};
	// var box = new THREE.Box3().setFromObject(ship.obj);
	// ship.obj.mesh.geometry.computeBoundingBox();
	// var bb = ship.obj.mesh.geometry.boundingBox;
	// var object3DWidth  = bb.max.x - bb.min.x;
	// var object3DHeight = bb.max.y - bb.min.y;
	// var object3DDepth  = bb.max.z - bb.min.z;
	// console.log(object3DDepth);
	// console.log(box.min, box.max, box.getSize());
	// console.log(typeof(ship));
	chest = new Chest(scene);
	scene.add(cube);
	
	const light = new THREE.DirectionalLight(0xffffff, 0.3);
	light.position.set(2, 2, 5);
	const Ambientlight = new THREE.AmbientLight(0xffffff, 0.7); 
	scene.add(Ambientlight);
	scene.add(light);
	// Position camera
	// camera.position.z = 5;
}

// Draw the scene every time the screen is refreshed
function animate() {
	requestAnimationFrame(animate);

	// Rotate cube (Change values to change speed)
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	// cube.rotation.z += 0.01;
	// camera.getWorldDirection()
	// camera.lookAt(a.position);
	// camera.lookAt(new THREE.Vector3(a.position.x, a.position.y, a.position.z));
	let delta = clock.getDelta();
	let d = new Date();
	let milli = d.getTime();

	if (ship.obj) {	 
		var box = new THREE.Box3().setFromObject(ship.obj);
		let pos = ship.obj.position;
		ship.obj.position.set(pos.x, properY + Math.sin(milli / 350) * 0.25, pos.z);
		if (chest.obj) {
			let pos2 = chest.obj.position;
			chest.obj.position.set(pos2.x, properYChest + Math.sin(milli / 225) * 0.1, pos2.z);
			// Collision detection
			if (chest.collected === 0 && collision(ship.obj, chest.obj)) {
				scene.remove(chest.obj);
				chest.collected = 1;
				console.log("hoory");
			}
		} 
		camera.lookAt(pos);
		CameraView = new THREE.Vector3(0, -4, -10);
		CameraView.applyAxisAngle(Yaxis, ship.obj.rotation.y);
		let angl = ship.obj.position.clone().sub(CameraView);
		let ForwardVector = new THREE.Vector3(0, 0, -5);
		ForwardVector.applyAxisAngle(Yaxis, ship.obj.rotation.y);
		ForwardVector.multiplyScalar(delta);
		camera.position.set(angl.x, angl.y, angl.z);
		let Xaxis = new THREE.Vector3(1, 0, 0);
		Xaxis.applyAxisAngle(Yaxis, ship.obj.position.y);
		if (moveForward) {
			ship.obj.position.add(ForwardVector);
			cube.position.add(ForwardVector);
		}
		if (moveBackward) {
			ship.obj.position.sub(ForwardVector);
			cube.position.sub(ForwardVector);
		}
		if (moveLeft) {
			let tempVec = Object.assign({}, ship.obj.position);
			ship.obj.position.set(0,0,0);
			ship.obj.rotation.y += rotateSpeed * delta;
			ship.obj.rotation.z = 0.3;
			ship.obj.position.set(tempVec.x, tempVec.y, tempVec.z);
		}
		if (moveRight) {
			let tempVec = Object.assign({}, ship.obj.position);
			ship.obj.position.set(0,0,0);
			ship.obj.rotation.y -= rotateSpeed * delta;
			ship.obj.rotation.z = -0.3;
			ship.obj.position.set(tempVec.x, tempVec.y, tempVec.z);
			// console.log(cube.position);
		}
	}

	renderer.render(scene, camera);

}

function onWindowResize() {
	// Camera frustum aspect ratio
	camera.aspect = window.innerWidth / window.innerHeight;
	// After making changes to aspect
	camera.updateProjectionMatrix();
	// Reset size
	renderer.setSize(window.innerWidth, window.innerHeight);
}

const onKeyDown = function (event) {
	switch (event.code) {

		case 'ArrowUp':
		case 'KeyW':
			moveForward = true;
			break;

		case 'ArrowLeft':
		case 'KeyA':
			moveLeft = true;
			break;

		case 'ArrowDown':
		case 'KeyS':
			moveBackward = true;
			break;

		case 'ArrowRight':
		case 'KeyD':
			moveRight = true;
			break;

		// case 'Space':
		// 	if ( canJump === true ) velocity.y += 350;
		// 	canJump = false;
		// 	break;

	}

};

const onKeyUp = function (event) {

	switch (event.code) {

		case 'ArrowUp':
		case 'KeyW':
			moveForward = false;
			ship.obj.rotation.x = 0.0; 
			break;

		case 'ArrowLeft':
		case 'KeyA':
			moveLeft = false;
			ship.obj.rotation.z = 0.0;
			break;

		case 'ArrowDown':
		case 'KeyS':
			ship.obj.rotation.x = 0.0; 
			moveBackward = false;
			break;

		case 'ArrowRight':
		case 'KeyD':
			moveRight = false;
			ship.obj.rotation.z = 0.0;
			break;

	}

};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );
init();
animate();
