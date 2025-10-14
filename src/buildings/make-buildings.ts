import { cityParams } from '../city-params';
import type { CityGrid } from '../city-grid.class';
import { Building } from './building.class';
import { SetbackTower } from './setback-tower';


const buildings: Building[] = [];

export function makeBuildings(cityGrid: CityGrid): Building[] {
    buildings.length = 0;
    for (let i = 0; i < cityGrid.gridItems.length; i++) {
        const x = cityGrid.gridItems[i].x;
        const z = cityGrid.gridItems[i].z;

        const maxDistance = cityParams.groundSize / 2;
        const distance = Math.sqrt(x * x + z * z);
        const falloff = Math.pow(1 - distance / maxDistance, 2)
        const height = Math.max(1, falloff * cityParams.maxHeight + Math.random() * 2);

        let newBuilding: Building = new Building(x, z, height, cityParams);

        if (height > cityParams.maxHeight * 0.2) {
            let layers = Math.floor(Math.random() * 2) + 2;
            if (height > cityParams.maxHeight * 0.5) {
                layers = Math.floor(Math.random() * 4) + 3;
            }
            if (height > cityParams.maxHeight * 0.7) {
                layers = Math.floor(Math.random() * 6) + 4;
            }
            newBuilding = new SetbackTower(x, z, height, layers, cityParams);
        }




        buildings.push(newBuilding)
    }
    return buildings;
}







// export function makeBuildings(params: CityParams, cityGrid: CityGrid): BuildingData[] {
//     const maxDistance = params.groundSize / 2;
//     buildings.length = 0;
//     for (let i = 0; i < params.buildingCount; i++) {
//         // Distance from center (0,0)
//         // Compute height based on distance
//         const radius = Math.random() * maxDistance;
//         const angle = Math.random() * Math.PI * 2;
//         const biasedRadius = Math.pow(radius, 0.9);
//         // const biasedRadius = radius
//         const x = Math.cos(angle) * biasedRadius;
//         const z = Math.sin(angle) * biasedRadius;



//         // console.log("X, Z positions:", x, z)
//         // const x = (Math.random() - 0.5) * 50;
//         // const z = (Math.random() - 0.5) * 50;
//         const distance = Math.sqrt(x * x + z * z);
//         // const falloff = 1 - distance / maxDistance;
//         const falloff = Math.pow(1 - distance / maxDistance, 2)
//         const height = Math.max(1, falloff * params.maxHeight + Math.random() * 2);
//         const y = height / 2;

//         // const randomColor = Math.random() * 0xffffff;
//         const randomWidth = 0.3 + Math.random() * (1.5 - 0.3);

//         const rainbowColors = [
//             '#FF0000', // Red
//             '#FF7F00', // Orange
//             '#FFFF00', // Yellow
//             '#00FF00', // Green
//             '#40E0D0', // Turquoise (more frequent)
//             '#40E0D0',
//             '#40E0D0',
//             '#FF69B4', // Hot Pink (more frequent)
//             '#FF69B4',
//             '#FF69B4',
//             '#FF1493', // Deep Pink (more frequent)
//             '#FF1493',
//             '#0000FF', // Blue
//             '#4B0082', // Indigo
//             '#8B00FF',  // Violet
//             '#000000',
//             '#111111',
//         ];


//         const randomIndex = Math.floor(Math.random() * rainbowColors.length);
//         const randomColor = rainbowColors[randomIndex];

//         const building = new THREE.Mesh(
//             new THREE.BoxGeometry(randomWidth, height, randomWidth),
//             new THREE.MeshStandardMaterial({ color: randomColor })
//         );

//         building.position.set(x, y, z);

//         buildings.push({
//             mesh: building,
//             baseHeight: height,
//             amplitude: 10 + Math.random() * 10, // how much it oscillates
//             speed: 0.1 + Math.random() * 1.5,   // how fast
//             phase: Math.random() * Math.PI * 2  // start offset
//         });

//     }
//     return buildings;
// }




// const rainbowColors = [
//     '#FF0000', // Red
//     '#FF7F00', // Orange
//     '#FFFF00', // Yellow
//     '#00FF00', // Green
//     '#0000FF', // Blue
//     '#4B0082', // Indigo
//     '#8B00FF'  // Violet
// ];

// const rainbowColors = [
//     '#FF0000', // Red
//     '#FF7F00', // Orange
//     '#FFFF00', // Yellow
//     '#00FF00', // Green
//     '#40E0D0', // Turquoise (more frequent)
//     '#40E0D0',
//     '#40E0D0',
//     '#0000FF', // Blue
//     '#4B0082', // Indigo
//     '#8B00FF'  // Violet
// ]