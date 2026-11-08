import { Color } from 'three';
import { describe, expect, it } from 'vitest';
import { BOARD_SIZE, PALETTE } from '../src/place';
import { buildPointCloud, fitDistance, pointSizeForFov } from '../src/pointcloud';

describe('buildPointCloud', () => {
  const pixels = new Uint8Array(BOARD_SIZE * BOARD_SIZE);
  pixels[0] = 5; // top-left: red
  pixels[BOARD_SIZE * BOARD_SIZE - 1] = 13; // bottom-right: blue
  const geometry = buildPointCloud(pixels);
  const position = geometry.getAttribute('position');
  const color = geometry.getAttribute('color');

  it('creates one point per pixel', () => {
    expect(position.count).toBe(BOARD_SIZE * BOARD_SIZE);
    expect(color.count).toBe(BOARD_SIZE * BOARD_SIZE);
  });

  it('centres the board on the origin with y up', () => {
    const last = BOARD_SIZE * BOARD_SIZE - 1;
    expect([position.getX(0), position.getY(0), position.getZ(0)]).toEqual([-499.5, 499.5, 0]);
    expect([position.getX(last), position.getY(last), position.getZ(last)]).toEqual([499.5, -499.5, 0]);
    expect([position.getX(1), position.getY(BOARD_SIZE)]).toEqual([-498.5, 498.5]);
  });

  it('round-trips palette colours through the linear working space', () => {
    const hexAt = (i: number) => new Color(color.getX(i), color.getY(i), color.getZ(i)).getHexString();
    expect(hexAt(0)).toBe(PALETTE[5].slice(1).toLowerCase());
    expect(hexAt(1)).toBe(PALETTE[0].slice(1).toLowerCase());
    expect(hexAt(BOARD_SIZE * BOARD_SIZE - 1)).toBe(PALETTE[13].slice(1).toLowerCase());
  });
});

describe('pointSizeForFov', () => {
  it('is 1 / tan(fov / 2)', () => {
    expect(pointSizeForFov(90)).toBeCloseTo(1);
    expect(pointSizeForFov(60)).toBeCloseTo(Math.sqrt(3));
  });
});

describe('fitDistance', () => {
  it('fits the board height in landscape viewports', () => {
    expect(fitDistance(90, 16 / 9, 1)).toBeCloseTo(BOARD_SIZE / 2);
  });

  it('backs off further in portrait viewports so the width still fits', () => {
    expect(fitDistance(90, 0.5, 1)).toBeCloseTo(BOARD_SIZE);
  });
});
