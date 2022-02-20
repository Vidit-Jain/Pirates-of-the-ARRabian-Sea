import * as THREE from "three"

let camera, scene, renderer, cube;

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

	// Init BoxGeometry object (rectangular cuboid)
	const geometry = new THREE.BoxGeometry(3, 3, 3);

	// Create material with color
	const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

	// Add texture - 
	// const texture = new THREE.TextureLoader().load('textures/crate.gif');

	// Create material with texture
	// const material = new THREE.MeshBasicMaterial({ map: texture });

	// Create mesh with geo and material
	cube = new THREE.Mesh(geometry, material);
	// Add to scene
	scene.add(cube);

	// Position camera
	camera.position.z = 5;
}

// Draw the scene every time the screen is refreshed
function animate() {
	requestAnimationFrame(animate);

	// Rotate cube (Change values to change speed)
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	cube.rotation.z += 0.01;

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
	  cube.position.z += 0.05;
	  return;
	}
	if (event.key == "S" || event.key == "s") {
	  cube.position.z -= 0.05;
	  return;
	}
	if (event.key == "A" || event.key == "a") {
	  cube.position.x -= 0.05;
	  return;
	}
	if (event.key == "d" || event.key == "D") {
	  cube.position.x += 0.05;
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
