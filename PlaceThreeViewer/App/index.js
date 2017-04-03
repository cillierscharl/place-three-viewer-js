define(["require", "exports", "utilities", "threeapp"], function (require, exports, utilities_1, threeapp_1) {
    "use strict";
    var Index = (function () {
        function Index() {
            var _this = this;
            this.LoadBitmap = function () {
                var _context = _this;
                var myRequest = new Request('getbitmap');
                fetch(myRequest).then(function (response) {
                    var arrayBuffer = response.arrayBuffer();
                    arrayBuffer.then(function (buf) {
                        _context.InitializeThree(utilities_1.BitMapHelpers.parseBitmap(new Uint8Array(buf)));
                    });
                });
            };
            this.InitializeThree = function (data) {
                var threeApp = new threeapp_1.ThreeApp();
                threeApp.initialize(data);
            };
            this.LoadBitmap();
        }
        return Index;
    }());
    return new Index();
});
//# sourceMappingURL=index.js.map