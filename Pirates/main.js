import * as THREE from "three"
import { Camera } from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Ship} from "./Ship.js"
let camera, scene, renderer, cube, cube2, ship;
let moveForward = false, moveBackward = false, moveRight = false, moveLeft = false;
let CameraView = new THREE.Vector3(0, 2, 5);
let Yaxis = new THREE.Vector3(0, 1, 0);
let rotateSpeed = 1;
let moveSpeed = 5;
let clock = new THREE.Clock();
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
	const texture = new THREE.TextureLoader().load('textures/text_example.jpeg');

	// // Create material with texture
	const material = new THREE.MeshBasicMaterial({ map: texture });

	// // Create mesh with geo and material
	cube = new THREE.Mesh(geometry, material);
	cube.position.y = -5;
	// cube2 = new THREE.Mesh(geometry2, material2);

	// // Add to scene
	// cube2.position.y = 5;
	// a.add(cube);
	// a.add(cube2);
	ship = new Ship(scene);
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
	if (ship.obj) {
		let pos = ship.obj.position;
		camera.lookAt(pos);
		CameraView = new THREE.Vector3(0, -4, -10);
		CameraView.applyAxisAngle(Yaxis, ship.obj.rotation.y);
		// console.log(CameraView);
		let angl = ship.obj.position.clone().sub(CameraView);
		// console.log(ship.obj.rotation.y);
		// camera.position.set(CameraView.x, CameraView.y, CameraView.z);
		// console.log(delta);
		let ForwardVector = new THREE.Vector3(0, 0, -5);
		ForwardVector.applyAxisAngle(Yaxis, ship.obj.rotation.y);
		camera.position.set(angl.x, angl.y, angl.z);
		let Xaxis = new THREE.Vector3(1, 0, 0);
		Xaxis.applyAxisAngle(Yaxis, ship.obj.position.y);
		if (moveForward) {
			let tempVec = Object.assign({}, ship.obj.position);
			ship.obj.position.set(0,0,0);
			// ship.obj.rotation.x = -0.1;
			ship.obj.position.set(tempVec.x, tempVec.y, tempVec.z);
			ship.obj.position.add(ForwardVector.clone().multiplyScalar(delta));
		}
		if (moveBackward) {
			let tempVec = Object.assign({}, ship.obj.position);
			ship.obj.position.set(0,0,0);
			// ship.obj.rotation.x = 0.1;
			ship.obj.position.set(tempVec.x, tempVec.y, tempVec.z);
			ship.obj.position.sub(ForwardVector.clone().multiplyScalar(delta));
		}
		if (moveLeft) {
			ship.obj.rotation.y += rotateSpeed * delta;
			ship.obj.rotation.z = 0.3;
		}
		if (moveRight) {
			ship.obj.rotation.y -= rotateSpeed * delta;
			ship.obj.rotation.z = -0.3;
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
