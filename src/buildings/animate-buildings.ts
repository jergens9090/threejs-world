import * as THREE from 'three';
import { Building } from "./building.class";
import { hexCityParams, modeParams, squareCityParams } from '../city-params';

export function animateBuildingsElevationOscillation(buildings: Building[], clock: THREE.Clock) {
    for (const b of buildings) {
        // Oscillate smoothly around baseHeight
        const time = clock.getElapsedTime();
        b.oscillateElevation(time);
    }
}




let cityWidth = hexCityParams.groundSize;
if (modeParams.mode === 'Square') {
    cityWidth = squareCityParams.groundSize;
}
// target position
let target: THREE.Vector3 = getRandomTarget();
let specificTarget: THREE.Vector3 | null = target;
// current position (the moving vertex)
const position = new THREE.Vector3(0, 0, 0);
function getRandomTarget(): THREE.Vector3 {
    const half = (cityWidth) * 0.8;
    const x = THREE.MathUtils.randFloat(-half, half);
    const z = THREE.MathUtils.randFloat(-half, half);
    return new THREE.Vector3(x, 0, z);
}
const threshold = 1.0; // how close we need to be before picking a new target
const speed = 1; // movement speed per frame
let centerOfElevation = {
    x: 0,
    z: 0,
}
function updateMovingVertex() {
    const direction = new THREE.Vector3().subVectors(target, position);
    const distance = direction.length();
    if (distance < threshold) {
        target = getRandomTarget();
    } else {
        direction.normalize();
        position.addScaledVector(direction, speed);
    }
    centerOfElevation.x = position.x;
    centerOfElevation.z = position.z;
}
export function setSpecificTarget(newTarget: THREE.Vector3 | null) {
    specificTarget = newTarget;
    if (newTarget !== null) {
        target = newTarget;

    }
}
export function updateBuildingsMovingTargetOscillation(buildings: Building[]) {
    updateMovingVertex();
    buildings.forEach(building => {
        building.updateElevationCenter(centerOfElevation);
    });
}