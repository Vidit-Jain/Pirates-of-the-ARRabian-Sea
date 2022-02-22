import * as THREE from "three"
import {Ship} from "./Ship.js"
import {Chest} from "./Chest.js"
let camera, scene, renderer, water, ship, chest; 
let moveForward = false, moveBackward = false, moveRight = false, moveLeft = false;
let CameraView = [new THREE.Vector3(0, -4, -10), new THREE.Vector3(0, -8, -10)];
let viewMode = 0;
let Yaxis = new THREE.Vector3(0, 1, 0);
let rotateSpeed = 1;
let moveSpeed = 5;
let clock = new THREE.Clock();
let lastChest = 5;
let properY = -0.4;
let properYChest = -0.1;
let points = 0;
let chests = [];
function collision(a, b) {
	var box1 = new THREE.Box3().setFromObject(a);
	var box2 = new THREE.Box3().setFromObject(b);
	return box1.intersectsBox(box2);
}
function setLighting(scene) {
	const DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
	DirectionalLight.position.set(2, 2, 5);
	const Ambientlight = new THREE.AmbientLight(0xffffff, 0.7); 
	scene.add(Ambientlight);
	scene.add(DirectionalLight);
}
function loadWater(scene) {
	const geometry = new THREE.BoxGeometry(1000, 0.2, 1000);
	const texture = new THREE.TextureLoader().load('textures/water.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(30, 30);
	const material = new THREE.MeshBasicMaterial({ map: texture });
	water = new THREE.Mesh(geometry, material);
	scene.add(water);
}
function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	setLighting(scene);
	loadWater(scene);

	ship = new Ship(scene);
	// let chestPos = new THREE.Vector3(10.5, 1.5, -5);
	// chest = new Chest(scene,chestPos);
	
}
function updateCamera(pos) {
	let view = CameraView[viewMode].clone() 
	view.applyAxisAngle(Yaxis, ship.obj.rotation.y);
	let cameraPos = ship.obj.position.clone().sub(view);
	camera.lookAt(pos);
	camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
}
function calcForwardVector() {
	let ForwardVector = new THREE.Vector3(0, 0, -1);
	ForwardVector.applyAxisAngle(Yaxis, ship.obj.rotation.y);
	return ForwardVector;
}
function generateChest(delta) {
	lastChest += delta;
	if (lastChest >= 5) {
		let radius = Math.random() * 40 + 15;
		console.log(radius);
		let angle = Math.random() * 360;
		let x = radius * Math.cos(angle);
		let z = radius * Math.sin(angle);
		let chestPos = new THREE.Vector3(x, 0, z);
		let chest = new Chest(scene, chestPos);
		chests.push(chest);
		lastChest = 0; 
		return true;
	}
	else return false;
}
// Draw the scene every time the screen is refreshed
function animate() {
	requestAnimationFrame(animate);

	let delta = clock.getDelta();
	let d = new Date();
	let milli = d.getTime();
	let generateFrame = !generateChest(delta);
	if (ship.obj) {	 
		let pos = ship.obj.position;
		ship.obj.position.set(pos.x, properY + Math.sin(milli / 350) * 0.25, pos.z);
		for (let i in chests) {
			let chest = chests[i];
			if (chest.obj) {
				let pos2 = chest.obj.position;
				chest.obj.position.set(pos2.x, properYChest + Math.sin(milli / 225) * 0.1, pos2.z);
				// Collision detection
				if (chest.collected === 0 && collision(ship.obj, chest.obj)) {
					scene.remove(chest.obj);
					chest.collected = 1;
					chests.splice(i, 1);
					console.log("hoory");
				}
			}
		}
		// if (chest.obj) {
		// 	let pos2 = chest.obj.position;
		// 	chest.obj.position.set(pos2.x, properYChest + Math.sin(milli / 225) * 0.1, pos2.z);
		// 	// Collision detection
		// 	if (chest.collected === 0 && collision(ship.obj, chest.obj)) {
		// 		scene.remove(chest.obj);
		// 		chest.collected = 1;
		// 		console.log("hoory");
		// 	}
		// } 
		let ForwardVector = calcForwardVector();
		ForwardVector.multiplyScalar(delta * moveSpeed);

		updateCamera(pos);
		if (moveForward) {
			ship.obj.position.add(ForwardVector);
			water.position.add(ForwardVector);
		}
		if (moveBackward) {
			ship.obj.position.sub(ForwardVector);
			water.position.sub(ForwardVector);
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
	if (generateFrame)
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
		case 'KeyQ':
			viewMode = 1 - viewMode;
			break;
	}

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
init();
animate();
