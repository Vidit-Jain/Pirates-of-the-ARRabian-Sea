import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Chest{
    constructor(scene, position){
        this.collected = 0;
        this.loadModel(scene, position);
        this.baseY = -0.6;
        this.bobblePeriod = 2.25;
        this.amplitude = 0.4;
        this.randomStart = Math.random() * 1000;
    }
    bobble(milli) {
        if (this.obj) {
            let pos = this.obj.position;
            this.obj.position.set(pos.x, this.baseY + Math.sin((milli + this.randomStart) / (this.bobblePeriod * 100)) * this.amplitude, pos.z);
        }
    } 
    loadModel(scene, position){
        var loader = new GLTFLoader();
        loader.load("./models/treasure.glb", (obj) => {
            obj.scene.scale.set(0.1,0.1,0.1);
            obj.scene.rotation.x = -0.5;
            obj.scene.rotation.z = -0.5;
            obj.scene.position.set(position.x, position.y, position.z);
            this.obj = obj.scene;
            scene.add(obj.scene);
        });
    }
}