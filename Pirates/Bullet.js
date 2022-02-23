import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
let Yaxis = new THREE.Vector3(0, 1, 0);
export class Bullet {
    constructor(){
        this.initRenderData();
        this.moveSpeed = 0.7;
        this.gravity = 0.3;
        this.alive = 0;
    }
    calcForwardVector() {
        let ForwardVector = new THREE.Vector3(0, 0, -1);
        ForwardVector.applyAxisAngle(Yaxis, this.obj.rotation.y);
        return ForwardVector;
    }
    createBullet() {
        const geometry = new THREE.SphereGeometry(0.33);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000});
        this.obj = new THREE.Mesh(geometry, material);
    }
    shoot(forwardVector, initPosition, scene) {
        this.forwardVector = forwardVector;
        this.alive = 1;
        this.velocityY = 0.0;
        console.log(initPosition);
        this.obj.position.set(initPosition.x, 3, initPosition.z);
        scene.add(this.obj);
        setTimeout(function() {
            scene.remove(this.obj);
            this.alive = 0;
        }, 2000);
    }
    move(delta, scene) {
        if (this.alive === 0) return;
        this.velocityY -= delta * this.gravity;
        let movement = this.forwardVector.clone();
        movement.multiplyScalar(this.moveSpeed);
        movement.add(new THREE.Vector3(0, this.velocityY, 0));
        this.obj.position.add(movement);
        if (this.obj.position.y <= 0) {
            this.alive = 0;
            scene.remove(this.obj);
        }
    }
    collides(box) {
        let sphere = new THREE.Sphere(this.obj.position, 0.33);
        return box.intersectsSphere(sphere);
    }
    initRenderData(){
        this.createBullet();
    }
    // move(delta, water) {
    //     if (this.obj) {	 
    //         let ForwardVector = this.calcForwardVector();
    //         ForwardVector.multiplyScalar(delta * this.moveSpeed);
    //         if (this.moveForward) {
    //             this.obj.position.add(ForwardVector);
    //             water.position.add(ForwardVector);
    //         }
    //         if (this.moveBackward) {
    //             this.obj.position.sub(ForwardVector);
    //             water.position.sub(ForwardVector);
    //         }
    //         if (this.moveLeft) {
    //             this.obj.rotation.y += this.rotateSpeed * delta;
    //             this.obj.rotation.z = 0.3;
    //         }
    //         if (this.moveRight) {
    //             this.obj.rotation.y -= this.rotateSpeed * delta;
    //             this.obj.rotation.z = -0.3;
    //         }
    //     }
    // }
}