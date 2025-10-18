import * as THREE from 'three'
import { Building } from "./building.class";
import { squareCityParams } from '../city-params';

export class SetbackTower extends Building {
    constructor(x: number, z: number, height: number, layers: number) {
        super(x, z, height);
        const meshGroup: THREE.Group = this._buildTower(x, z, layers);
        this._setMeshGroup(meshGroup);
    }

    public oscillateElevation(time: number): void {
        const minHeight = this.baseHeight;       // your chosen minimum
        const maxHeight = this.baseHeight * 1.5;   // or any ratio you like
        const t = (Math.sin(time * this.speed + this.phase) + 1) / 2;
        const newHeight = minHeight + (maxHeight - minHeight) * t;
        // Update scale/position
        this.mesh.scale.y = newHeight / this.baseHeight;
    }

    private _buildTower(x: number, z: number, numLayers: number): THREE.Group {
        const group = new THREE.Group();

        let randomHeights = Array.from({ length: numLayers }, () => Math.random());
        const sumHeights = randomHeights.reduce((a, b) => a + b, 0);
        const layerHeights = randomHeights.map(h => (h / sumHeights) * this.baseHeight);
        let currentY = 0;

        function randomSize() {
            const minWidth = Math.min(1, squareCityParams.gridSquareWidth);
            const maxWidth = squareCityParams.gridSquareWidth;
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