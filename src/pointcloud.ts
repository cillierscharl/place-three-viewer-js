import { BufferAttribute, BufferGeometry, Color, MathUtils } from 'three';
import { BOARD_SIZE, PALETTE } from './place';

/** One point per board pixel, centred on the origin, y up, coloured from the palette. */
export function buildPointCloud(pixels: Uint8Array): BufferGeometry {
  // Color converts the sRGB hex values into three's linear working space,
  // so the renderer's sRGB output reproduces the palette exactly.
  const palette = PALETTE.map((hex) => new Color(hex));
  const count = BOARD_SIZE * BOARD_SIZE;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const half = (BOARD_SIZE - 1) / 2;

  for (let i = 0; i < count; i++) {
    const x = i % BOARD_SIZE;
    const y = Math.floor(i / BOARD_SIZE);
    positions[3 * i] = x - half;
    positions[3 * i + 1] = half - y;

    const colour = palette[pixels[i]];
    colors[3 * i] = colour.r;
    colors[3 * i + 1] = colour.g;
    colors[3 * i + 2] = colour.b;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  return geometry;
}

/**
 * PointsMaterial size that makes each point exactly one world unit wide when
 * seen face-on, so neighbouring pixels tile without gaps at any zoom.
 * three scales attenuated points by (viewport height / 2) / depth, while one
 * world unit spans viewport height / (2 · depth · tan(fov / 2)).
 */
export function pointSizeForFov(fovDegrees: number): number {
  return 1 / Math.tan(MathUtils.degToRad(fovDegrees) / 2);
}

/** Camera distance at which the whole board fits the viewport, with a small margin. */
export function fitDistance(fovDegrees: number, aspect: number, margin = 1.1): number {
  const fitHeight = (BOARD_SIZE / 2) / Math.tan(MathUtils.degToRad(fovDegrees) / 2);
  return (fitHeight * margin) / Math.min(aspect, 1);
}
