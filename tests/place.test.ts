import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BOARD_SIZE, PALETTE, decodeBoard } from '../src/place';

const BITMAP_BYTES = 4 + (BOARD_SIZE * BOARD_SIZE) / 2;

function bitmap(timestamp: number, bodyByte: (index: number) => number, size = BITMAP_BYTES): ArrayBuffer {
  const buffer = new ArrayBuffer(size);
  new DataView(buffer).setUint32(0, timestamp, true);
  const bytes = new Uint8Array(buffer);
  for (let i = 4; i < size; i++) {
    bytes[i] = bodyByte(i - 4);
  }
  return buffer;
}

describe('decodeBoard', () => {
  it('reads the little-endian Unix timestamp header', () => {
    const board = decodeBoard(bitmap(1491433590, () => 0));
    expect(board.timestamp.toISOString()).toBe('2017-04-05T23:06:30.000Z');
  });

  it('unpacks two pixels per byte, left pixel in the high nibble', () => {
    const board = decodeBoard(bitmap(0, (i) => (i === 0 ? 0x5f : i === 1 ? 0x30 : 0)));
    expect(Array.from(board.pixels.subarray(0, 4))).toEqual([0x5, 0xf, 0x3, 0x0]);
    expect(board.pixels).toHaveLength(BOARD_SIZE * BOARD_SIZE);
  });

  it('places the last byte at the bottom-right of the board', () => {
    const board = decodeBoard(bitmap(0, (i) => (i === BITMAP_BYTES - 5 ? 0xab : 0)));
    expect(board.pixels[BOARD_SIZE * BOARD_SIZE - 2]).toBe(0xa);
    expect(board.pixels[BOARD_SIZE * BOARD_SIZE - 1]).toBe(0xb);
  });

  it('ignores trailing bytes after the board', () => {
    const board = decodeBoard(bitmap(0, () => 0x11, BITMAP_BYTES + 501));
    expect(board.pixels.every((p) => p === 1)).toBe(true);
  });

  it('rejects a truncated bitmap', () => {
    expect(() => decodeBoard(new ArrayBuffer(BITMAP_BYTES - 1))).toThrow(/expected at least 500004/);
  });

  it('decodes the bundled 2017 snapshot', () => {
    const file = readFileSync(new URL('../public/place.bmp', import.meta.url));
    const board = decodeBoard(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength));

    expect(board.timestamp.toISOString()).toBe('2017-04-05T23:06:30.000Z');

    const used = new Set(board.pixels);
    expect(used.size).toBe(PALETTE.length);
  });
});
