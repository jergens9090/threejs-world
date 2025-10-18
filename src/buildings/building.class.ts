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

export abstract class Building {


    private _buildingData: BuildingData;
    private _color: string = "0x000000";
    private _isActivated: boolean = false;

    public get color(): string { return this._color; }
    public get buildingData(): BuildingData { return this._buildingData; }
    public get mesh(): THREE.Mesh | THREE.Group { return this.buildingData.mesh; }
    public get baseHeight(): number { return this.buildingData.baseHeight; }
    public get amplitude(): number { return this.buildingData.amplitude; }
    public get speed(): number { return this.buildingData.speed; }
    public get phase(): number { return this.buildingData.phase; }
    public get isActivated(): boolean { return this._isActivated; }


    abstract oscillateElevation(time: number): void;


    updateElevationCenter(elevationCenter: { x: number, z: number }) {
        const newX = elevationCenter.x;
        const newZ = elevationCenter.z;
        const maxDistance = squareCityParams.groundSize / 2;
        const dx = newX - this.mesh.position.x;
        const dz = newZ - this.mesh.position.z
        const distance = Math.sqrt(dx * dx + dz * dz);
        const falloff = Math.max(0, 1 - distance / maxDistance);
        const height = Math.max(1, Math.pow(falloff, 2) *  hexCityParams.maxHeight * 2);
        this._buildingData.mesh.scale.y = height / this.baseHeight;
        this._buildingData.mesh.position.y = height / 2;
    }

    public activate(time: number) {
        this._isActivated = !this._isActivated;
        const minHeight = this.baseHeight;       // your chosen minimum
        const maxHeight = this.baseHeight * 1.5;   // or any ratio you like
        // normalize sine from [-1, 1] → [0, 1]
        const t = (Math.sin(time * this.speed + this.phase) + 1) / 2;
        const newHeight = minHeight + (maxHeight - minHeight) * t;

        // Update scale/position
        this.mesh.scale.y = newHeight / this.baseHeight;
        this.mesh.position.y = newHeight / 2;
    }



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
    // protected _setHeight(height: number) {
    //     this._buildingData.baseHeight = height;
    //     this._buildingData.mesh.scale.y = height;
    // }


}