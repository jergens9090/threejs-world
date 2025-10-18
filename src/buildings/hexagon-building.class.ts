import * as THREE from 'three';
import { Building } from "./building.class";
import { hexCityParams } from '../city-params';

export class HexagonBuilding extends Building {
    constructor(x: number, z: number, height: number) {
        super(x, z, height);
        // const meshGroup: THREE.Group = this._buildTower(x, z, layers, params);
        // this._setMeshGroup(meshGroup);
        const radius = hexCityParams.hexagonRadius * 0.9;
        this._setMesh(this._buildHexagon(x, z, radius, height))
    }


    private _buildHexagon(x: number, z: number, radius: number, height: number,) {
        const geometry = new THREE.CylinderGeometry(radius, radius, height, 6);
        const material = new THREE.MeshStandardMaterial({ color: this.color });
        const hexPlate = new THREE.Mesh(geometry, material);
        hexPlate.position.x = x;

        hexPlate.position.z = z;
        hexPlate.position.y = height / 2;
        hexPlate.rotation.y = Math.PI / 2;
        return hexPlate;
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
}