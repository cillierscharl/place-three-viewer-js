import './style.css';
import { Color, PerspectiveCamera, Points, PointsMaterial, Scene, WebGLRenderer, type BufferGeometry } from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { decodeBoard } from './place';
import { buildPointCloud, fitDistance, pointSizeForFov } from './pointcloud';

const status = document.querySelector<HTMLElement>('#status')!;
const snapshot = document.querySelector<HTMLElement>('#snapshot')!;

async function main(): Promise<void> {
  const response = await fetch(`${import.meta.env.BASE_URL}place.bmp`);
  if (!response.ok) {
    throw new Error(`Couldn't load the canvas (HTTP ${response.status}).`);
  }
  const board = decodeBoard(await response.arrayBuffer());

  startViewer(buildPointCloud(board.pixels));

  const when = board.timestamp.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' });
  snapshot.textContent = `Snapshot from ${when} UTC`;
  status.remove();
}

function startViewer(geometry: BufferGeometry): void {
  const renderer = new WebGLRenderer();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.prepend(renderer.domElement);

  const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10_000);
  camera.position.z = fitDistance(camera.fov, camera.aspect);

  const scene = new Scene();
  scene.background = new Color('#111111');
  scene.add(new Points(geometry, new PointsMaterial({ size: pointSizeForFov(camera.fov), vertexColors: true })));

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 2;
  controls.zoomSpeed = 1.5;
  controls.panSpeed = 0.8;
  controls.minDistance = 20;
  controls.maxDistance = 5000;

  // Only redraw when the view actually moves.
  let dirty = true;
  controls.addEventListener('change', () => {
    dirty = true;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
    dirty = true;
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {
      controls.reset();
    }
  });

  renderer.setAnimationLoop(() => {
    controls.update();
    if (dirty) {
      renderer.render(scene, camera);
      dirty = false;
    }
  });
}

main().catch((error: unknown) => {
  status.textContent = error instanceof Error ? error.message : String(error);
  status.classList.add('error');
});
