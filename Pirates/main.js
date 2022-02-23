import * as THREE from "three"
import {Ship} from "./Ship.js"
import {Chest} from "./Chest.js"
import { Enemy } from "./Enemy.js";
let camera, scene, renderer, water, ship, enemy; 
let chests = [];
let enemies = [];

let CameraView = [new THREE.Vector3(0, -4, -10), new THREE.Vector3(0, -8, -10)];
let viewMode = 0;
let Yaxis = new THREE.Vector3(0, 1, 0);
let clock = new THREE.Clock();
let lastChest = 5;
let lastEnemy = 10;
let points = 0;
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
	console.log(water);
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
	
}
function updateCamera() {
	if (!ship.obj) return;
	let pos = ship.obj.position;
	let view = CameraView[viewMode].clone() 
	view.applyAxisAngle(Yaxis, ship.obj.rotation.y);
	let cameraPos = ship.obj.position.clone().sub(view);
	camera.lookAt(pos);
	camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
}
function generateChest(delta) {
	lastChest += delta;
	if (lastChest >= 5) {
		let radius = Math.random() * 40 + 15;
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
function generateEnemy(delta) {
	lastEnemy += delta;
	if (lastEnemy >= 15) {
		let radius = 80; 
		let angle = Math.random() * 360;
		let x = radius * Math.cos(angle);
		let z = radius * Math.sin(angle);
		let enemyPos = new THREE.Vector3(x, 0, z);
		console.log(enemyPos);
		let enemy = new Enemy(scene, enemyPos);
		enemies.push(enemy);
		lastEnemy = 0; 
		return true;
	}
	else return false;
}
function updateHUD() {
	document.querySelector('#HUD').innerHTML = `Score: ${points}`
}
function updatePoints(x) {
	points += x;
	updateHUD();
}
function checkChestCollected() {
	if (!ship.obj) return;
	for (let i in chests) {
		let chest = chests[i];
		if (chest.obj) {
			if (chest.collected === 0 && collision(ship.obj, chest.obj)) {
				scene.remove(chest.obj);
				chest.collected = 1;
				chests.splice(i, 1);
				updatePoints(10);
			}
		}
	}
}
function checkEnemyCollision() {
	if (!ship.obj) return;
	for (let i in enemies) {
		let enemy = enemies[i];	
		if (enemy.obj) {
			if (collision(enemy.obj, ship.obj)) {
				scene.remove(ship.obj);
				ship.dead = 1;
			}
		}
	}
}
function bobbleChests(milli) {
	for (let i in chests) {
		chests[i].bobble(milli);	
	}
}
function checkEnemiesKilled() {
	for (let i in enemies) {
		let enemy = enemies[i];
		if (enemy.obj) {
			var box = new THREE.Box3().setFromObject(enemy.obj);
			if (ship.killed(box)) {
				scene.remove(enemies[i].obj);
				updatePoints(15);
				enemies.splice(i, 1);
			}
		}
	}
}
function enemyMove(delta) {
	if (ship.obj && !ship.dead) {
		for (let i in enemies) {
			enemies[i].move(delta, ship.obj.position);
		}
	}
}
// Draw the scene every time the screen is refreshed
function animate() {
	requestAnimationFrame(animate);

	let delta = clock.getDelta();
	let d = new Date();
	let milli = d.getTime();
	generateChest(delta);
	generateEnemy(delta);
	ship.bobble(milli);
	bobbleChests(milli);
	updateCamera();
	checkChestCollected();
	checkEnemyCollision();
	checkEnemiesKilled();
	enemyMove(delta);
	ship.move(delta, water, scene);
	renderer.render(scene, camera);

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

const onKeyDown = function (event) {
	switch (event.code) {
		case 'ArrowUp':
		case 'KeyW':
			ship.moveForward = true;
			break;

		case 'ArrowLeft':
		case 'KeyA':
			ship.moveLeft = true;
			break;

		case 'ArrowDown':
		case 'KeyS':
			ship.moveBackward = true;
			break;

		case 'ArrowRight':
		case 'KeyD':
			ship.moveRight = true;
			break;
	}

};

const onKeyUp = function (event) {

	switch (event.code) {

		case 'ArrowUp':
		case 'KeyW':
			ship.moveForward = false;
			ship.obj.rotation.x = 0.0; 
			break;

		case 'ArrowLeft':
		case 'KeyA':
			ship.moveLeft = false;
			ship.obj.rotation.z = 0.0;
			break;

		case 'ArrowDown':
		case 'KeyS':
			ship.moveBackward = false;
			ship.obj.rotation.x = 0.0; 
			break;

		case 'ArrowRight':
		case 'KeyD':
			ship.moveRight = false;
			ship.obj.rotation.z = 0.0;
			break;
		case 'KeyQ':
			viewMode = 1 - viewMode;
			break;
		case 'Space':
			ship.shoot(scene);
			console.log("HI");
			break;
	}

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
init();
animate();
