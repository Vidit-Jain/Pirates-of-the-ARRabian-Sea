import * as THREE from "three"
import {Ship} from "./Ship.js"
import {Chest} from "./Chest.js"
import { Enemy } from "./Enemy.js";
import { Water } from './jsm/objects/Water.js';
import { Sky } from './jsm/objects/Sky.js';
let camera, scene, renderer, water, ship, enemy; 
let isOver = 0;
let chests = [];
let enemies = [];

let CameraView = [new THREE.Vector3(0, -4, -10), new THREE.Vector3(0, -8, -10)];
let viewMode = 0;
let Yaxis = new THREE.Vector3(0, 1, 0);
let clock = new THREE.Clock();
let sun;
let lastChest = 5;
let lastEnemy = 10;
let points = 0;
let curr_time = 0;
let treasures_collected = 0;
const resultsElement = document.getElementById("results");
function collision(a, b) {
	var box1 = new THREE.Box3().setFromObject(a);
	var box2 = new THREE.Box3().setFromObject(b);
	return box1.intersectsBox(box2);
}
function init() {
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	// Water text
	sun = new THREE.Vector3();

	// Water

	const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

	water = new Water(
		waterGeometry,
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {

				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			} ),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 3.7,
			fog: scene.fog !== undefined
		}
	);

	water.rotation.x = - Math.PI / 2;

	scene.add( water );


	const sky = new Sky();
	sky.scale.setScalar( 10000 );
	scene.add( sky );

	const skyUniforms = sky.material.uniforms;
	// Water text end
	// setLighting(scene);
	// loadWater(scene);
	skyUniforms[ 'turbidity' ].value = 10;
	skyUniforms[ 'rayleigh' ].value = 2;
	skyUniforms[ 'mieCoefficient' ].value = 0.005;
	skyUniforms[ 'mieDirectionalG' ].value = 0.8;

	const parameters = {
		elevation: 2,
		azimuth: 180
	};

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	document.body.appendChild(renderer.domElement);
	const pmremGenerator = new THREE.PMREMGenerator( renderer );

	function updateSun() {

		const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
		const theta = THREE.MathUtils.degToRad( parameters.azimuth );

		sun.setFromSphericalCoords( 1, phi, theta );

		sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
		water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

		scene.environment = pmremGenerator.fromScene( sky ).texture;

	}
	updateSun();


	ship = new Ship(scene);
	
	const listener = new THREE.AudioListener();
	camera.add( listener );

	const sound = new THREE.Audio( listener );

	const audioLoader = new THREE.AudioLoader();
	audioLoader.load( 'sounds/pirates.mp3', function( buffer ) {
		sound.setBuffer( buffer );
		sound.setLoop( true );
		sound.setVolume( 0.5 );
		sound.play();
	});
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
	document.querySelector('#HUD2').innerHTML = 
	`Score: ${points} <br> 
	 Treasures Collected: ${treasures_collected}<br>
	`;
	document.querySelector("#HUD").innerHTML =
	`
	 Time: ${Math.floor(curr_time)}<br>
	 Ship Health: ${ship.health}
	`
}
function updatePoints(x) {
	points += x;
}
function checkChestCollected() {
	if (!ship.obj) return;
	for (let i in chests) {
		let chest = chests[i];
		if (chest.obj) {
			if (chest.collected === 0 && collision(ship.obj, chest.obj)) {
				scene.remove(chest.obj);
				chest.collected = 1;
				treasures_collected++;
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
			enemies[i].move(delta, ship.obj.position, scene);
		}
	}
}
function playerDied() {
	if (ship.obj && !ship.dead) {
		var box = new THREE.Box3().setFromObject(ship.obj);
		for (let i in enemies) {
			if (enemies[i].killed(box)) {
				ship.health--;
				enemies[i].bullet.alive = 0;
				scene.remove(enemies[i].bullet.obj);
				if (ship.health === 0) {
					scene.remove(ship.obj);
					ship.dead = 1;
					return true;	
				}
			}
		}
	}
	return false;
}

function enemyShoot() {
	for (let i in enemies) {
		enemies[i].shoot(scene, ship.obj.position);
	}
}
// Draw the scene every time the screen is refreshed
function animate() {
	requestAnimationFrame(animate);
	water.material.uniforms[ 'time' ].value += 1.0 / 450.0;
	updateHUD();

	if (isOver === 0) {
		let delta = clock.getDelta();
		curr_time += delta;
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
		enemyShoot();
		playerDied();
		enemyMove(delta);
		ship.move(delta, water, scene);
		if (ship.dead === 1) isOver = 1;
		renderer.render(scene, camera);
	}
	else {
		document.querySelector('#results').innerHTML = `Game Over!<br>Score: ${points}`
		if (resultsElement) resultsElement.style.display = "flex";
		renderer.setAnimationLoop(null); // Stop animation loop
	}

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
			break;
	}

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
init();
animate();
