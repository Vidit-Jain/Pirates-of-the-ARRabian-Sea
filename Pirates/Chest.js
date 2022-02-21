import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Chest{
    constructor(scene){
        // this.dist = 0;
        // this.score = 0;
        // this.health = 100;
        // this.time = 50;
        // this.VELOCITY = 1;
        this.collected = 0;
        this.initRenderData(scene);
    }
    
    initRenderData(scene){
        var loader = new GLTFLoader();
        loader.load("./models/chest.glb", (obj) => {
            // var box = new THREE.Box3().setFromObject(obj.scene);
            // this.box = box;
            obj.scene.scale.set(0.1,0.1,0.1);
            obj.scene.rotation.x = 0.5;
            obj.scene.rotation.z = 0.5;
            obj.scene.position.z = -5;
            obj.scene.position.y = 1.5;
            obj.scene.position.x = 10.5;
            this.obj = obj.scene;
            scene.add(obj.scene);
        });
    }
}