define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BitMapHelpers = /** @class */ (function () {
        function BitMapHelpers() {
        }
        BitMapHelpers.parseBitmap = function (input) {
            var buf = new Uint8Array(input.buffer, 4);
            var out = new Uint8Array(1000 * 1000);
            for (var i = 0; i < input.byteLength; i++) {
                out[2 * i] = buf[i] >> 4;
                out[2 * i + 1] = buf[i] & 15;
            }
            return out;
        };
        return BitMapHelpers;
    }());
    exports.BitMapHelpers = BitMapHelpers;
});
//# sourceMappingURL=utilities.js.map