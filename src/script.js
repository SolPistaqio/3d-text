import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Group } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/9.png");
const matcap2ndTexture = textureLoader.load("/textures/matcaps/2.png");

// Fonts

const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log("font loaded");
  const textGeometry = new TextGeometry("Hello World!", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 4, //lower for performance
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4, //lower for performance //
  });

  //centering text HARD WAY
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  // );

  // EASY way
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.castShadow = true;

  // gui.add(text, "size").min(0).max(1).step(0.0001);
  scene.add(text);
});

// axis helper

// const axisHelper = new THREE.AxesHelper();
// scene.add(axisHelper);

// sky

scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

// light

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
hemiLight.castShadow = true;
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(3, 10, 10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(dirLight);

/**
 * Ground
 */

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0xa0a0a0, roughness: 0.7 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
ground.receiveShadow = true;
scene.add(ground);

// scene.add(cube);
// const donutGeometry = new THREE.TorusGeometry(0.15, 0.1, 20, 45);
const donutGeometry = new THREE.IcosahedronGeometry(0.15, 1);
const diamondGeometry = new THREE.OctahedronGeometry(0.2, 0);
const tetrahedronGeometry = new THREE.TetrahedronGeometry(0.15, 0);
const donutMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcap2ndTexture,
});

const objects = new THREE.Group();

const addToGroup = (geometry, material, number) => {
  for (let index = 0; index < number; index++) {
    const donut = new THREE.Mesh(geometry, material);
    donut.position.x = (Math.random() - 0.5) * 30;
    donut.position.y = (Math.random() - 0.5) * 30;
    donut.position.z = (Math.random() - 0.5) * 30;
    donut.rotation.x = Math.PI * Math.random();
    donut.rotation.y = Math.PI * Math.random();
    const randomScale = Math.random();

    donut.scale.set(randomScale, randomScale, randomScale);
    donut.castShadow = true;
    objects.add(donut);
  }
  scene.add(objects);
};

addToGroup(diamondGeometry, donutMaterial, 200);
addToGroup(donutGeometry, donutMaterial, 200);
addToGroup(tetrahedronGeometry, donutMaterial, 200);

for (let index = 0; index < 400; index++) {
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  objects.add(donut);
  donut.position.x = (Math.random() - 0.5) * 30;

  donut.position.y = (Math.random() - 0.5) * 30;
  donut.position.z = (Math.random() - 0.5) * 30;
  donut.rotation.x = Math.PI * Math.random();
  donut.rotation.y = Math.PI * Math.random();
  const randomScale = Math.random();

  donut.scale.set(randomScale, randomScale, randomScale);
  donut.castShadow = true;
}
scene.add(objects);

// trees
const geometry = new THREE.ConeGeometry(1, 3);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cone = new THREE.Mesh(geometry, material);
cone.position.x = -2;
cone.position.z = -1;
cone.castShadow = true;
scene.add(cone);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 5;
camera.position.y = 1;
camera.position.z = 5;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.keyPanSpeed = 3;
controls.maxPolarAngle = Math.PI * 0.5;
controls.maxDistance = 15;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //animate objects

  objects.rotation.x = (elapsedTime / 60) * Math.PI * 2;
  objects.rotation.y = (elapsedTime / 90) * Math.PI * 2;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
