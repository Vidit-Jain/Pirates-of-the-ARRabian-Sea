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
        this.boundingBox = [[100, -100], [100, -100], [100, -100]];
        this.initRenderData(scene);
    }
    
    initRenderData(scene){
        var loader = new GLTFLoader();
        loader.load("./models/ship_light.glb", (obj) => {
            // var box = new THREE.Box3().setFromObject(obj.scene);
            // box.applyMatrix4(obj.scene.matrixWorld);
            console.log("HI");
            console.log(obj);
            // console.log(box.min);
            // console.log(box.max);
            // console.log(box);
            // console.log(typeof(box));
            // var q = box.getSize();
            // console.log(q);
            // this.box = box;
            // console.log(box.min, box.max, box.getSize());
            // for (let a in obj.scene.children) {
            // //     a.geometry.boundingBox();
            //     let x = obj.scene.children[a].geometry.boundingBox;
            //     this.boundingBox[0][0] = Math.min(this.boundingBox[0][0], x.min.x);
            //     this.boundingBox[0][1] = Math.max(this.boundingBox[0][1], x.max.x);
            //     this.boundingBox[1][0] = Math.min(this.boundingBox[1][0], x.min.y);
            //     this.boundingBox[1][1] = Math.max(this.boundingBox[1][1], x.max.y);
            //     this.boundingBox[2][0] = Math.min(this.boundingBox[2][0], x.min.z);
            //     this.boundingBox[2][1] = Math.max(this.boundingBox[2][1], x.max.z);
            //     // console.log(obj.scene.children[a].geometry.boundingBox.min);
            // }
            // console.log(this.boundingBox[0][0]);
            // console.log(this.boundingBox[0][1]);
            // console.log(this.boundingBox[1][0]);
            // console.log(this.boundingBox[1][1]);
            // console.log(this.boundingBox[2][0]);
            // console.log(this.boundingBox[2][1]);
            // console.log(typeof(obj.asset));
            // var position = new THREE.Vector3();
            // position.getPositionFromMatrix( obj.scene.matrixWorld );
            // console.log(position.x + ',' + position.y + ',' + position.z);
            console.log(obj);
            obj.scene.scale.set(0.1,0.1,0.1);
            obj.scene.position.z = -5;
            obj.scene.position.y = -2;
            this.obj = obj.scene;
            scene.add(obj.scene);
        });
    }
}