import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export class Ship{
    constructor(scene){
        this.initRenderData(scene);
    }
    
    initRenderData(scene){
        var loader = new GLTFLoader();
        loader.load("./models/ship_light.glb", (obj) => {
            obj.scene.scale.set(0.1,0.1,0.1);
            obj.scene.position.z = -5;
            obj.scene.position.y = -2;
            this.obj = obj.scene;
            scene.add(obj.scene);
        });
    }
}