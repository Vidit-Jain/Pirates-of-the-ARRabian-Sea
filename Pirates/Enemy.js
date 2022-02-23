import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Bullet } from "./Bullet";
let Yaxis = new THREE.Vector3(0, 1, 0);
export class Enemy{
    constructor(scene, pos){
        this.initRenderData(scene, pos);
        this.baseY = -0.4;
        this.bobblePeriod = 3.5;
        this.amplitude = 0.25;
        this.moveSpeed = 3;
        this.moveForward = false
        this.moveBackward = false
        this.moveRight = false
        this.moveLeft = false;
        this.dead = 0;
        this.lastShot = 0;
        this.bullet = new Bullet();
    }
    calcForwardVector() {
        let ForwardVector = new THREE.Vector3(0, 0, -1);
        ForwardVector.applyAxisAngle(Yaxis, this.obj.rotation.y);
        return ForwardVector;
    }
    bobble(milli) {
        if (!this.obj) return;
		let pos = this.obj.position;
		this.obj.position.set(pos.x, this.baseY + Math.sin(milli / (this.bobblePeriod * 100)) * this.amplitude, pos.z);
    }  
    initRenderData(scene, pos){
        var loader = new GLTFLoader();
        loader.load("./models/ship_light.glb", (obj) => {
            obj.scene.scale.set(0.1,0.1,0.1);
            obj.scene.position.set(pos.x, -0.7, pos.z);

            this.obj = obj.scene;
            scene.add(obj.scene);
        });
    }
    move(delta, playerPos, scene) {
        if (!this.obj) return;
        this.lastShot += delta;
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
        if (this.bullet.alive) {
            this.bullet.move(delta, scene);
        }
    }
    shoot(scene, position) {
        if (this.lastShot >= 4) {
            let forwardVector = position.clone().sub(this.obj.position); 
            forwardVector.normalize();
            this.lastShot = 0;
            this.bullet.shoot(forwardVector, this.obj.position.clone(), scene);
        }
    }
    killed(box) {
        if (this.bullet.alive === 0) return false;
        return this.bullet.collides(box);
    }
}