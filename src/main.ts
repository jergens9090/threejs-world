import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { makeBuildingHexagonGrid, makeBuildingsSquareGrid } from './buildings/make-buildings';
import { squareCityParams, gui, modeParams } from './city-params';
import { HexagonCityGrid } from './grids/hexagon-city-grid.class';
import { SquareCityGrid } from './grids/square-city-grid.class';
import { animateBuildingsElevationOscillation, setSpecificTarget, updateBuildingsMovingTargetOscillation } from './buildings/animate-buildings';



// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0c8ff); // sky blue

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(111, 100, 111);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- WASD movement setup ---
const keysPressed: Record<string, boolean> = {};
window.addEventListener('keydown', (e) => keysPressed[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keysPressed[e.key.toLowerCase()] = false);

const moveSpeed = 1;
const moveDir = new THREE.Vector3();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);

// Handle window resize
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const ground = new THREE.Mesh(
	new THREE.PlaneGeometry(squareCityParams.groundSize, squareCityParams.groundSize),
	new THREE.MeshStandardMaterial({ color: squareCityParams.groundColor })
);
ground.rotation.x = -Math.PI / 2;


let cityGridSquares = new SquareCityGrid();
let cityGridHexagons = new HexagonCityGrid();


let squareBuildings = makeBuildingsSquareGrid(cityGridSquares);
let hexagonBuildings = makeBuildingHexagonGrid(cityGridHexagons);
function regenerateCity() {
	// Remove old buildings
	scene.children = scene.children.filter(obj => !(obj instanceof THREE.Mesh) && !(obj instanceof THREE.Group));
	if (modeParams.mode === 'Hexagon') {
		cityGridHexagons = new HexagonCityGrid();
		hexagonBuildings = makeBuildingHexagonGrid(cityGridHexagons);
		hexagonBuildings.forEach(building => scene.add(building.mesh));
	} else if (modeParams.mode === 'Square') {
		cityGridSquares = new SquareCityGrid();
		squareBuildings = makeBuildingsSquareGrid(cityGridSquares);
		squareBuildings.forEach(building => scene.add(building.mesh));

	}
	scene.add(ground);
}


function addMouseClickListener() {
}

function addMouseMoveListener() {
	// change color on mousemove
	window.addEventListener('mousemove', (event) => {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length > 0) {
			const obj = intersects[0].object;
			/** Change object to random color */
			// const randomColor = Math.random() * 0xffffff;
			// if (obj instanceof THREE.Mesh && obj.id !== ground.id) {
			// 	(obj.material as THREE.MeshStandardMaterial).color.set(randomColor);
			// }

			/** Change specific target */
			setSpecificTarget(new THREE.Vector3(obj.position.x, 0, obj.position.z));
		} else {
			setSpecificTarget(null);
		}
	});
}



gui.onChange(regenerateCity);
gui.controllers.forEach(c => c.onFinishChange(regenerateCity));

regenerateCity();


let angle = 0; // initial rotation angle
function rotateCamera() {
	const radius = 150; // distance from the center
	angle += 0.002;     // rotation speed (smaller = slower)
	camera.position.x = Math.cos(angle) * radius;
	camera.position.z = Math.sin(angle) * radius;
	camera.lookAt(0, 0, 0); // look toward the middle / height of your buildings
}

addMouseClickListener();
addMouseMoveListener();


const clock = new THREE.Clock();
function animate() {
	requestAnimationFrame(animate);
	updateBuildingsMovingTargetOscillation([...squareBuildings, ...hexagonBuildings]);
	// animateBuildingsElevationOscillation([...squareBuildings, ...hexagonBuildings], clock);
	rotateCamera();


	// --- WASD Movement relative to camera view ---
	camera.getWorldDirection(forward);
	forward.y = 0;
	forward.normalize();

	right.crossVectors(forward, up).normalize();

	moveDir.set(0, 0, 0);
	if (keysPressed['w']) moveDir.add(forward);
	if (keysPressed['s']) moveDir.sub(forward);
	if (keysPressed['a']) moveDir.sub(right);
	if (keysPressed['d']) moveDir.add(right);
	if (keysPressed[' ']) moveDir.y += 1;
	if (keysPressed['shift']) moveDir.y -= 1;

	if (moveDir.lengthSq() > 0) {
		moveDir.normalize().multiplyScalar(moveSpeed);
		camera.position.add(moveDir);
		controls.target.add(moveDir); // 🔥 keeps orbit target in sync with camera
	}
	renderer.render(scene, camera);
	controls.update();
}
animate();