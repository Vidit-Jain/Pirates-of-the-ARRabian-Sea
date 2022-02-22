import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Chest{
    constructor(scene, position){
        this.collected = 0;
        this.loadModel(scene, position);
    }
    
    loadModel(scene, position){
        var loader = new GLTFLoader();
        loader.load("./models/chest.glb", (obj) => {
            obj.scene.scale.set(0.1,0.1,0.1);
            obj.scene.rotation.x = 0.5;
            obj.scene.rotation.z = 0.5;
            obj.scene.position.set(position.x, position.y, position.z);
            this.obj = obj.scene;
            scene.add(obj.scene);
        });
    }
}