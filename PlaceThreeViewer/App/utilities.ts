export class BitMapHelpers {

    public static parseBitmap = (input) => {
        const buf = new Uint8Array(input.buffer, 4);
        const out = new Uint8Array(1000 * 1000);
        for (let i = 0; i < input.byteLength; i++) {
            out[2 * i] = buf[i] >> 4;
            out[2 * i + 1] = buf[i] & 15;
        }
        return out;
    }

}


