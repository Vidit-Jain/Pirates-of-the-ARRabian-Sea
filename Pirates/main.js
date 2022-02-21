import * as THREE from "three"
import { Camera } from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Ship} from "./Ship.js"
let camera, scene, renderer, cube, cube2, a;
let CameraView = new THREE.Vector3(0, 2, 5);
let Yaxis = new THREE.Vector3(0, 1, 0);

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
	// const geometry = new THREE.BoxGeometry(3, 3, 8);
	// const geometry2 = new THREE.BoxGeometry(1, 1, 2);

	// const material2 = new THREE.MeshBasicMaterial({color: 0xffffff});
	// // Create material with color
	// const texture = new THREE.TextureLoader().load('./textures/wood.jpeg');
	// const material = new THREE.MeshBasicMaterial({map: texture});

	
	// // Add texture - 
	// // const texture = new THREE.TextureLoader().load('textures/crate.gif');

	// // Create material with texture
	// // const material = new THREE.MeshBasicMaterial({ map: texture });

	// // Create mesh with geo and material
	// cube = new THREE.Mesh(geometry, material);
	// cube2 = new THREE.Mesh(geometry2, material2);

	// // Add to scene
	// cube2.position.y = 5;
	// a.add(cube);
	// a.add(cube2);
	a = new Ship(scene);
	// scene.add(a);
	
	const light = new THREE.DirectionalLight(0xffffff, 0.3);
	light.position.set(2, 2, 5);
	const Ambientlight = new THREE.AmbientLight(0xffffff, 0.7); // soft white light
	scene.add(Ambientlight);
	scene.add(light);
	// Position camera
	camera.position.z = 5;
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
	if (a.obj) {
		let pos = a.obj.position;
		camera.lookAt(pos);
		CameraView = new THREE.Vector3(0, 1, -10);
		CameraView.applyAxisAngle(Yaxis, a.obj.rotation.y);
		// console.log(CameraView);
		let angl = a.obj.position.clone().sub(CameraView);
		console.log(a.obj.rotation.y);
		// camera.position.set(CameraView.x, CameraView.y, CameraView.z);
		camera.position.set(angl.x, angl.y, angl.z);
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



window.addEventListener("keydown", function (event) {
	if (event.key == "W" || event.key == "w") {
	  a.obj.position.z += 0.05;
	  return;
	}
	if (event.key == "S" || event.key == "s") {
	  a.obj.position.z -= 0.05;
	  return;
	}
	if (event.key == "A" || event.key == "a") {
	  a.obj.rotation.y -= 0.05;
	  return;
	}
	if (event.key == "d" || event.key == "D") {
	//   a.obj.position.x += 0.05;
	  a.obj.rotation.y += 0.05;
	  return;
	}
	if (event.key == "Q" || event.key == "q") {
	  a.obj.position.y += 0.05;
	  return;
	}
	if (event.key == "E" || event.key == "e") {
	  a.obj.position.y -= 0.05;
	  return;
	}
	// if (event.key == "ArrowDown") {
	//   decelerate = true;
	//   return;
	// }
	// if (event.key == "R" || event.key == "r") {
	//   reset();
	//   return;
	// }
  });

init();
animate();
