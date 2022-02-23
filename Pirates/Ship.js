import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Bullet } from "./Bullet";
let Yaxis = new THREE.Vector3(0, 1, 0);
export class Ship {
    constructor(scene){
        this.initRenderData(scene);
        this.baseY = -0.7;
        this.bobblePeriod = 3.5;
        this.amplitude = 0.25;
        this.moveSpeed = 5;
        this.moveForward = false
        this.rotateSpeed = 1;
        this.moveBackward = false
        this.moveRight = false
        this.moveLeft = false;
        this.dead = 0;
        this.bullet = new Bullet();
        this.lastShot = 5;
    }
    bobble(milli) {
        if (!this.obj) return;
		let pos = this.obj.position;
		this.obj.position.set(pos.x, this.baseY + Math.sin(milli / (this.bobblePeriod * 100)) * this.amplitude, pos.z);
    }  
    calcForwardVector() {
        let ForwardVector = new THREE.Vector3(0, 0, -1);
        ForwardVector.applyAxisAngle(Yaxis, this.obj.rotation.y);
        return ForwardVector;
    }
    initRenderData(scene){
        var loader = new GLTFLoader();
        loader.load("./models/ship_light.glb", (obj) => {
            obj.scene.scale.set(0.1,0.1,0.1);
            obj.scene.position.z = -5;
            obj.scene.position.y = -2;
            obj.scene.position.x = -10;
            obj.scene.rotation.set(0,0,0);
            this.obj = obj.scene;
            scene.add(obj.scene);
        });
    }
    move(delta, water) {
        if (this.obj) {	 
            let ForwardVector = this.calcForwardVector();
            ForwardVector.multiplyScalar(delta * this.moveSpeed);
            if (this.moveForward) {
                this.obj.position.add(ForwardVector);
                water.position.add(ForwardVector);
            }
            if (this.moveBackward) {
                this.obj.position.sub(ForwardVector);
                water.position.sub(ForwardVector);
            }
            if (this.moveLeft) {
                this.obj.rotation.y += this.rotateSpeed * delta;
                this.obj.rotation.z = 0.3;
            }
            if (this.moveRight) {
                this.obj.rotation.y -= this.rotateSpeed * delta;
                this.obj.rotation.z = -0.3;
            }
        }
        if (this.bullet.alive) {
            this.bullet.move(delta);
        }
    }
    shoot(scene) {
        let forwardVector = this.calcForwardVector();
        forwardVector.normalize();
        this.bullet.shoot(forwardVector, this.obj.position.clone(), scene);
    }
}