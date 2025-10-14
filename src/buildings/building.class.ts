import * as THREE from 'three';
import type { CityParams } from "../city-params";


export interface BuildingData {
    mesh: THREE.Mesh | THREE.Group;
    baseHeight: number;
    amplitude: number;
    speed: number;
    phase: number;
}

export class Building {


    private _buildingData: BuildingData;
    private _color: string = "0x000000";

    public get color(): string { return this._color; }
    public get buildingData(): BuildingData { return this._buildingData; }
    public get mesh(): THREE.Mesh | THREE.Group { return this.buildingData.mesh; }
    public get baseHeight(): number { return this.buildingData.baseHeight; }
    public get amplitude(): number { return this.buildingData.amplitude; }
    public get speed(): number { return this.buildingData.speed; }
    public get phase(): number { return this.buildingData.phase; }

    private _setColor() {
        const rainbowColors = [
            '#FF0000', // Red
            '#FF7F00', // Orange
            '#FFFF00', // Yellow
            '#00FF00', // Green
            '#40E0D0', // Turquoise (more frequent)
            '#FF1493',
            '#0000FF', // Blue
            '#4B0082', // Indigo
            '#8B00FF',  // Violet
        ];
        const randomIndex = Math.floor(Math.random() * rainbowColors.length);
        const randomColor = rainbowColors[randomIndex];
        this._color = randomColor;
    }

    constructor(x: number, z: number, height: number, params: CityParams) {
        this._setColor();

        const y = height / 2;

        function randomSize() {
            const minWidth = Math.min(1, params.gridSquareWidth);
            const maxWidth = params.gridSquareWidth;
            const randomSize = minWidth + (Math.random() * maxWidth - minWidth);
            return randomSize;
        }

        // const minWidth = Math.min(1, params.gridSquareWidth);
        // const maxWidth = params.gridSquareWidth;
        // const randomWidth = minWidth + Math.random() * (maxWidth - minWidth);

        const randomWidth = randomSize();
        const randomLength = randomSize();






        const buildingMesh = new THREE.Mesh(
            new THREE.BoxGeometry(randomWidth, height, randomLength),
            new THREE.MeshStandardMaterial({ color: this.color })
        );

        buildingMesh.position.set(x, y, z);

        this._buildingData = {
            mesh: buildingMesh,
            baseHeight: height,
            amplitude: 10 + Math.random() * 10, // how much it oscillates
            speed: 0.1 + Math.random() * 1.5,   // how fast
            phase: Math.random() * Math.PI * 2  // start offset
        }
    }

    protected _setMeshGroup(group: THREE.Group) {
        this._buildingData.mesh = group;
    }
}