/** The 2017 /r/place board is 1000×1000 pixels. */
export const BOARD_SIZE = 1000;

/** The 16-colour 2017 palette, indexed by the 4-bit values in the bitmap. */
export const PALETTE = [
  '#FFFFFF', '#E4E4E4', '#888888', '#222222',
  '#FFA7D1', '#E50000', '#E59500', '#A06A42',
  '#E5D900', '#94E044', '#02BE01', '#00D3DD',
  '#0083C7', '#0000EA', '#CF6EE4', '#820080',
] as const;

const HEADER_BYTES = 4;
const BODY_BYTES = (BOARD_SIZE * BOARD_SIZE) / 2;

export interface Board {
  /** When reddit served this snapshot. */
  timestamp: Date;
  /** Palette index of every pixel, row by row from the top-left. */
  pixels: Uint8Array;
}

/**
 * Decodes the bitmap reddit served from /api/place/board-bitmap in 2017:
 * a 4-byte little-endian Unix timestamp, then two pixels per byte with the
 * left pixel in the high nibble. Trailing bytes after the board are ignored.
 */
export function decodeBoard(buffer: ArrayBuffer): Board {
  const expected = HEADER_BYTES + BODY_BYTES;
  if (buffer.byteLength < expected) {
    throw new Error(`Board bitmap is ${buffer.byteLength} bytes; expected at least ${expected}.`);
  }

  const seconds = new DataView(buffer).getUint32(0, true);
  const body = new Uint8Array(buffer, HEADER_BYTES, BODY_BYTES);
  const pixels = new Uint8Array(BOARD_SIZE * BOARD_SIZE);
  for (let i = 0; i < BODY_BYTES; i++) {
    pixels[2 * i] = body[i] >> 4;
    pixels[2 * i + 1] = body[i] & 0x0f;
  }

  return { timestamp: new Date(seconds * 1000), pixels };
}
