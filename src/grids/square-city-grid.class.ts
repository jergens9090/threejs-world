import { squareCityParams } from "../city-params";

export interface SquareGridItem {
    x: number;
    z: number;
    indices: { x: number; z: number }[];
}

export class SquareCityGrid {

    private _gridItems: SquareGridItem[] = [];
    public get gridItems(): SquareGridItem[] { return this._gridItems; }


    constructor() {
        this._buildGrid();
    }

    private _buildGrid() {
        const gridItemFullWidth = squareCityParams.gridSquareWidth + squareCityParams.gridDividerWidth;
        const origin = { x: (squareCityParams.groundSize / -2) + Math.ceil(gridItemFullWidth / 2), z: (squareCityParams.groundSize / -2) + Math.ceil(gridItemFullWidth / 2) };
        let currentPosition: { x: number, z: number } = Object.assign({}, origin);

        const gridItems: SquareGridItem[] = [];

        while ((currentPosition.x) < squareCityParams.groundSize / 2) {
            while ((currentPosition.z) < squareCityParams.groundSize / 2) {
                const indices = [
                    { x: currentPosition.x, z: currentPosition.z },
                    { x: currentPosition.x, z: currentPosition.z + squareCityParams.gridSquareWidth },
                    { x: currentPosition.x + squareCityParams.gridSquareWidth, z: currentPosition.z + squareCityParams.gridSquareWidth },
                    { x: currentPosition.x + squareCityParams.gridSquareWidth, z: currentPosition.z },
                ]
                const gridItem: SquareGridItem = {
                    x: currentPosition.x,
                    z: currentPosition.z,
                    indices: indices,
                }
                gridItems.push(gridItem);
                currentPosition.z += gridItemFullWidth;
            }
            currentPosition.z = origin.z;
            currentPosition.x += gridItemFullWidth;
        }

        this._gridItems = gridItems;
    }



}