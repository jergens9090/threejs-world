import type { CityParams } from "./city-params";

export interface GridItem {
    x: number;
    z: number;
    indices: { x: number; z: number }[];
}

export class CityGrid {

    private _gridItems: GridItem[] = [];
    public get gridItems(): GridItem[] { return this._gridItems; }


    constructor(cityParams: CityParams) {
        this._buildGrid(cityParams);
    }

    private _buildGrid(cityParams: CityParams) {
        const gridItemFullWidth = cityParams.gridSquareWidth + cityParams.gridDividerWidth;
        const origin = { x: (cityParams.groundSize / -2) + Math.ceil(gridItemFullWidth / 2), z: (cityParams.groundSize / -2) + Math.ceil(gridItemFullWidth / 2) };
        let currentPosition: { x: number, z: number } = Object.assign({}, origin);

        const gridItems: GridItem[] = [];

        while ((currentPosition.x) < cityParams.groundSize / 2) {
            while ((currentPosition.z) < cityParams.groundSize / 2) {
                const indices = [
                    { x: currentPosition.x, z: currentPosition.z },
                    { x: currentPosition.x, z: currentPosition.z + cityParams.gridSquareWidth },
                    { x: currentPosition.x + cityParams.gridSquareWidth, z: currentPosition.z + cityParams.gridSquareWidth },
                    { x: currentPosition.x + cityParams.gridSquareWidth, z: currentPosition.z },
                ]
                const gridItem: GridItem = {
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