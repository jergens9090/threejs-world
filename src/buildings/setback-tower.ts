import * as THREE from 'three';
import type { CityParams } from "../city-params";
import { Building } from "./building.class";

export class SetbackTower extends Building {
    constructor(x: number, z: number, height: number, layers: number, params: CityParams) {
        super(x, z, height, params);
        const meshGroup: THREE.Group = this._buildTower(x, z, layers, params);
        this._setMeshGroup(meshGroup);
    }

    private _buildTower(x: number, z: number, numLayers: number, params: CityParams): THREE.Group {
        const group = new THREE.Group();

        console.log("Building Tower")
        // Generate random relative height proportions for each layer
        let randomHeights = Array.from({ length: numLayers }, () => Math.random());
        const sumHeights = randomHeights.reduce((a, b) => a + b, 0);
        const layerHeights = randomHeights.map(h => (h / sumHeights) * this.baseHeight);
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
            const height = layerHeights[i];
            const width = randomWidth * (1 - i * (0.15 + Math.random() * 0.05)); // narrower each layer

            if (width > 0.1) {
                const geometry = new THREE.BoxGeometry(width, height, width);
                const mesh = new THREE.Mesh(geometry, material);

                // Position this layer so it sits on top of the previous one
                currentY += height / 2;
                mesh.position.y = currentY;
                mesh.position.x = x;
                mesh.position.z = z;
                group.add(mesh);
                currentY += height / 2; // top of this layer for next one
            }


        }

        return group;
    }
}