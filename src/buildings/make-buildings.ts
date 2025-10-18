import { hexCityParams, squareCityParams } from '../city-params';
import type { HexagonCityGrid } from '../grids/hexagon-city-grid.class';
import type { SquareCityGrid } from '../grids/square-city-grid.class';
import { Building } from './building.class';
import { HexagonBuilding } from './hexagon-building.class';
import { SetbackTower } from './setback-tower';
import { SpiralTower } from './spiral-tower';
import { SquareBuilding } from './square-building';


const buildings: Building[] = [];

export function makeBuildingsSquareGrid(cityGrid: SquareCityGrid): Building[] {
    buildings.length = 0;
    for (let i = 0; i < cityGrid.gridItems.length; i++) {
        const x = cityGrid.gridItems[i].x;
        const z = cityGrid.gridItems[i].z;
        const maxDistance = squareCityParams.groundSize / 2;
        const distance = Math.sqrt(x * x + z * z);
        const falloff = Math.max(0, 1 - distance / maxDistance);
        const height = Math.max(1, Math.pow(falloff, 2) * hexCityParams.maxHeight * 2);
        
        let newBuilding: Building = new SquareBuilding(x, z, height);
        if (height > squareCityParams.maxHeight * 0.2) {
            let layers = Math.floor(Math.random() * 2) + 2;
            if (height > squareCityParams.maxHeight * 0.5) {
                layers = Math.floor(Math.random() * 4) + 3;
            }
            if (height > squareCityParams.maxHeight * 0.7) {
                layers = Math.floor(Math.random() * 6) + 4;
            }
            if (Math.random() > 0.8) {
                newBuilding = new SpiralTower(x, z, height);
            } else {
                newBuilding = new SetbackTower(x, z, height, layers);
            }
        }
        buildings.push(newBuilding)
    }
    return buildings;
}




const hexagonBuildings: HexagonBuilding[] = [];

export function makeBuildingHexagonGrid(cityGrid: HexagonCityGrid): Building[] {
    hexagonBuildings.length = 0;
    for (let i = 0; i < cityGrid.gridItems.length; i++) {
        const x = cityGrid.gridItems[i].x;
        const z = cityGrid.gridItems[i].z;
        const maxDistance = hexCityParams.groundSize / 2;
        const distance = Math.sqrt(x * x + z * z);
        const falloff = Math.max(0, 1 - distance / maxDistance);
        const height = Math.max(1, Math.pow(falloff, 2) * hexCityParams.maxHeight * 2);
        let newHexBuilding: HexagonBuilding = new HexagonBuilding(x, z, height);
        hexagonBuildings.push(newHexBuilding)
    }
    return hexagonBuildings;
}







