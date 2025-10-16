import { hexCityParams } from "../city-params";


export interface HexagonGridVertex {
    x: number;
    z: number;
}

export class HexagonCityGrid {

    private _gridItems: HexagonGridVertex[] = [];
    public get gridItems(): HexagonGridVertex[] { return this._gridItems; }


    constructor() {
        this._gridItems = this._buildHexagonGrid(hexCityParams.hexagonRadius, hexCityParams.hexagonBuffer, hexCityParams.groundSize);
    }

    private _buildHexagonGrid(tileRadius: number, tileBuffer: number, planeWidth: number): HexagonGridVertex[] {
        const effectiveRadius = tileRadius + tileBuffer;
        const halfHeight = Math.sqrt(Math.abs(((tileRadius / 2) ** 2) - (tileRadius ** 2))) + (tileBuffer / 2);
        const effectiveHeight = (halfHeight * 2) + tileBuffer;
        /**
         * In the "horizontal" configuration of a hexagon grid, meaning the orientation of the hexagon is such that 
         * the bottom of the hexagon is an edge / line, and is not a point,
         * 
         * the first column is width of 2*radius and each subsequent column adds an additional width of 1.5 * radius
         * every second column will have minus one height, unless there is additional space at the end.
         */
        let columnsHaveSameHeight = false;
        let currentWidth = 2 * effectiveRadius;
        let actualWidth = currentWidth;
        const additionalColWidth = 1.5 * effectiveRadius;
        let columnCount = 1;
        while (currentWidth < planeWidth) {
            const remainingWidth = planeWidth - currentWidth;
            if (remainingWidth >= additionalColWidth) {
                currentWidth += additionalColWidth;
                columnCount++;
                actualWidth = currentWidth;
            } else {
                currentWidth = planeWidth + 1;
            }
        }
        let rowCount = Math.floor(planeWidth / effectiveHeight);
        let actualZDepth = rowCount * effectiveHeight;
        if ((planeWidth - (rowCount * effectiveHeight)) > halfHeight) {
            columnsHaveSameHeight = true;
            actualZDepth += (effectiveHeight / 2);
        }
        // const offsetX = (planeWidth - actualWidth) / 2;
        // const offsetZ = (planeWidth - actualZDepth) / 2;
        
        const offsetX = -(actualWidth/2);
        const offsetZ = -(actualZDepth/2);
        
        // let startX = 250;
        // let startZ = 250;
        let startX = 0;
        let startZ = 0;


        const hexagonVertices: HexagonGridVertex[] = [];

        for (let column = 0; column < columnCount; column++) {
            for (let row = 0; row < rowCount; row++) {
                if (column % 2 == 0) {
                    //if it is an even column
                    startX = offsetX + effectiveRadius + (column * additionalColWidth);
                    startZ = offsetZ + effectiveHeight / 2 + (effectiveHeight * row);
                    hexagonVertices.push({ x: startX, z: startZ });
                } else {
                    //if it is an odd column
                    startX = offsetX + (effectiveRadius * 2) + (column * additionalColWidth) - effectiveRadius;
                    startZ = offsetZ + effectiveHeight + (effectiveHeight * row);
                    if (columnsHaveSameHeight) {

                        hexagonVertices.push({ x: startX, z: startZ });
                    } else {
                        if (row != rowCount - 1) {
                            hexagonVertices.push({ x: startX, z: startZ });
                        }
                    }
                }
            }
        }
        return hexagonVertices;
    }



}