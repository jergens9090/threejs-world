import * as THREE from 'three';
import type { CityParams } from "../city-params";
import { Building } from "./building.class";

export class SpiralTower extends Building {
    constructor(x: number, z: number, height: number, params: CityParams) {
        super(x, z, height, params);
        const meshGroup: THREE.Group = this._buildTower(x, z, params);
        this._setMeshGroup(meshGroup);
    }

    private _buildTower(x: number, z: number, params: CityParams): THREE.Group {
        const group = new THREE.Group();
        const numLayers = 10 + Math.floor(Math.random() * 50);
        const layerHeight = this.baseHeight / numLayers;
        const totalRotation = THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(30, 180));
        const rotationPerLayer = totalRotation / numLayers;

        let currentY = 0;

        function randomSize() {
            const minWidth = Math.min(1, params.gridSquareWidth);
            const maxWidth = params.gridSquareWidth;
            const randomSize = minWidth + Math.random() * (maxWidth - minWidth);
            return randomSize;
        }
        const randomWidth = randomSize();
        const material = new THREE.MeshStandardMaterial({ color: this.color });
        for (let i = 0; i < numLayers; i++) {
            const geometry = new THREE.BoxGeometry(randomWidth, layerHeight, randomWidth);
            const mesh = new THREE.Mesh(geometry, material);

            // Position each layer vertically
            currentY += layerHeight / 2;
            mesh.position.y = currentY;
            mesh.position.x = x;
            mesh.position.z = z;

            // Apply gradual rotation around Y axis
            mesh.rotation.y = rotationPerLayer * i;

            group.add(mesh);
            currentY += layerHeight / 2;
        }

        return group;
    }
}