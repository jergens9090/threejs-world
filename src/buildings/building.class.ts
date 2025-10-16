import * as THREE from 'three';
import { squareCityParams } from "../city-params";
import { hexCityParams } from "../city-params";


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

    constructor(x: number, z: number, height: number) {
        const y = height / 2;
        this._setColor();
        if (squareCityParams !== null) {
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
            squareBuildingMesh.position.set(x, y, z);
            this._buildingData = {
                mesh: squareBuildingMesh,
                baseHeight: height,
                amplitude: 10 + Math.random() * 10, // how much it oscillates
                speed: 0.1 + Math.random() * 1.5,   // how fast
                phase: Math.random() * Math.PI * 2  // start offset
            }
        } else {
            const hexBuildingMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(hexCityParams.hexagonRadius, hexCityParams.hexagonRadius, height, 6),
                new THREE.MeshStandardMaterial({ color: this.color })
            );
            this._buildingData = {
                mesh: hexBuildingMesh,
                baseHeight: height,
                amplitude: 10 + Math.random() * 10, // how much it oscillates
                speed: 0.1 + Math.random() * 1.5,   // how fast
                phase: Math.random() * Math.PI * 2  // start offset
            }
        }

    }

    protected _setMeshGroup(group: THREE.Group) {
        this._buildingData.mesh = group;
    }
    protected _setMesh(mesh: THREE.Mesh) {
        this._buildingData.mesh = mesh;
    }
}