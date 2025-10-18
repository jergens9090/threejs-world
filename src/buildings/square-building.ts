import * as THREE from 'three';
import { Building } from "./building.class";
import { squareCityParams } from '../city-params';

export class SquareBuilding extends Building {
    constructor(x: number, z: number, height: number) {
        super(x, z, height);
        this._buildTower(x, z, height);
    }

    public oscillateElevation(time: number): void {
        const minHeight = this.baseHeight;       // your chosen minimum
        const maxHeight = this.baseHeight * 1.5;   // or any ratio you like
        const t = (Math.sin(time * this.speed + this.phase) + 1) / 2;
        const newHeight = minHeight + (maxHeight - minHeight) * t;
        // Update scale/position
        this.mesh.scale.y = newHeight / this.baseHeight;
        this.mesh.position.y = newHeight / 2;
    }


    private _buildTower(x: number, z: number, height: number) {
        function randomSize() {
            const minWidth = Math.min(1, squareCityParams.gridSquareWidth);
            const maxWidth = squareCityParams.gridSquareWidth;
            const randomSize = minWidth + (Math.random() * maxWidth - minWidth);
            return randomSize;
        }
        const randomWidth = randomSize();
        const randomLength = randomSize();
        const squareBuildingMesh = new THREE.Mesh(
            new THREE.BoxGeometry(randomWidth, height, randomLength),
            new THREE.MeshStandardMaterial({ color: this.color })
        );
        squareBuildingMesh.position.set(x, height/2, z);
        this._setMesh(squareBuildingMesh);
    }
}