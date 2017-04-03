import three = require("three");
import { BitMapHelpers } from "App/utilities";
import { ThreeApp } from "App/threeapp";

class Index {
    constructor() {
        this.LoadBitmap();
    }

    LoadBitmap = () => {
        var _context = this;
        var myRequest = new Request('http://localhost:3000/getbitmap');

        fetch(myRequest).then(function (response) {
            var arrayBuffer = response.arrayBuffer();
            arrayBuffer.then((buf) => {
                _context.InitializeThree(BitMapHelpers.parseBitmap(new Uint8Array(buf)));
            });
        });

    }

    InitializeThree = (data) => {
        var threeApp = new ThreeApp();
        threeApp.initialize(data);
    }
}

export = new Index();