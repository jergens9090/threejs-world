import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'lil-gui';
import { makeBuildings } from './buildings/make-buildings';
import { cityParams } from './city-params';
import { CityGrid } from './city-grid.class';
import { Building } from './buildings/building.class';
import { SetbackTower } from './buildings/setback-tower';

const gui = new GUI();

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


gui.add(cityParams, 'buildingCount', 50, 500, 10).name('Buildings');
gui.add(cityParams, 'maxHeight', 5, 50, 1).name('Max Height');
gui.add(cityParams, 'gridSquareWidth', 2, 12, 1).name('Square Width')
gui.add(cityParams, 'gridDividerWidth', 1, 3, 0.5).name('Divider Width')

const ground = new THREE.Mesh(
	new THREE.PlaneGeometry(cityParams.groundSize, cityParams.groundSize),
	new THREE.MeshStandardMaterial({ color: cityParams.groundColor })
);
ground.rotation.x = -Math.PI / 2;

let cityGrid = new CityGrid(cityParams);

let buildings = makeBuildings(cityGrid);
function regenerateCity() {
	// Remove old buildings
	scene.children = scene.children.filter(obj => !(obj instanceof THREE.Mesh) && !(obj instanceof THREE.Group));
	cityGrid = new CityGrid(cityParams);
	buildings = makeBuildings(cityGrid);
	buildings.forEach(building => scene.add(building.mesh));
	scene.add(ground);
}

// Change building color on click
window.addEventListener('click', (event) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length > 0) {
		const obj = intersects[0].object;
		const randomColor = Math.random() * 0xffffff;
		if (obj instanceof THREE.Mesh && obj.id !== ground.id) {
			(obj.material as THREE.MeshStandardMaterial).color.set(randomColor);
		}

	}
});


gui.onChange(regenerateCity);
gui.controllers.forEach(c => c.onFinishChange(regenerateCity));

regenerateCity();
const clock = new THREE.Clock();

function animateBuildings() {
	const time = clock.getElapsedTime();

	for (const b of buildings) {
		// Oscillate smoothly around baseHeight

		if (b instanceof SetbackTower) {
			const minHeight = b.baseHeight;       // your chosen minimum
			const maxHeight = b.baseHeight * 1.5;   // or any ratio you like
			const t = (Math.sin(time * b.speed + b.phase) + 1) / 2;
			const newHeight = minHeight + (maxHeight - minHeight) * t;

			// Update scale/position
			b.mesh.scale.y = newHeight / b.baseHeight;
			// b.mesh.position.y = newHeight / 2;
		} else if (b instanceof Building) {
			const minHeight = b.baseHeight;       // your chosen minimum
			const maxHeight = b.baseHeight * 1.5;   // or any ratio you like
			// normalize sine from [-1, 1] → [0, 1]
			const t = (Math.sin(time * b.speed + b.phase) + 1) / 2;
			const newHeight = minHeight + (maxHeight - minHeight) * t;

			// Update scale/position
			b.mesh.scale.y = newHeight / b.baseHeight;
			b.mesh.position.y = newHeight / 2;
		}


	}
}

let angle = 0; // initial rotation angle
function rotateCamera() {
	const radius = 150; // distance from the center
	angle += 0.002;     // rotation speed (smaller = slower)

	camera.position.x = Math.cos(angle) * radius;
	camera.position.z = Math.sin(angle) * radius;
	camera.lookAt(0, 0, 0); // look toward the middle / height of your buildings

}


function animate() {
	requestAnimationFrame(animate);


	animateBuildings();
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