import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export class Enemy{
    constructor(scene){
        this.initRenderData(scene);
        this.baseY = -0.4;
        this.bobblePeriod = 3.5;
        this.amplitude = 0.25;
        this.moveSpeed = 3;
        this.moveForward = false
        this.moveBackward = false
        this.moveRight = false
        this.moveLeft = false;
    }
    bobble(milli) {
        if (!this.obj) return;
		let pos = this.obj.position;
		this.obj.position.set(pos.x, this.baseY + Math.sin(milli / (this.bobblePeriod * 100)) * this.amplitude, pos.z);
    }  
    initRenderData(scene){
        var loader = new GLTFLoader();
        loader.load("./models/ship_light.glb", (obj) => {
            obj.scene.scale.set(0.1,0.1,0.1);
            obj.scene.position.z = -50;
            obj.scene.position.y = -0.7;
            obj.scene.position.x = -10;
            this.obj = obj.scene;
            scene.add(obj.scene);
        });
    }
    move(delta, playerPos) {
        if (!this.obj) return;
        let ForwardVector = playerPos.clone();
        ForwardVector.sub(this.obj.position);
        let pos = ForwardVector;
        ForwardVector.set(pos.x, 0, pos.z);
        ForwardVector.normalize();
        let ab = this.obj.position.clone();
        ab.sub(playerPos);
        let bc = this.obj.position.clone();
        bc.add(ab);
        this.obj.lookAt(bc);
        ForwardVector.multiplyScalar(delta * this.moveSpeed);
        this.obj.position.add(ForwardVector);
    }
}