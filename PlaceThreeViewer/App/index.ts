import three = require("three");

class Index {
    constructor() {
        this.LoadBitmap();
    }

    LoadBitmap = () => {
        var _context = this;
        var myRequest = new Request('http://localhost:3000/getbitmap');
        myRequest.headers.set('responseType', 'arraybuffer');

        fetch(myRequest).then(function (response) {
            var arrayBuffer = response.arrayBuffer();
            arrayBuffer.then((buf) => {
                _context.InitializeThree(_context.parseBitmap(new Uint8Array(buf)));
            });
        })

    }

    parseBitmap = (input) => {
        const buf = new Uint8Array(input.buffer, 4);
        const out = new Uint8Array(1000 * 1000);
        for (let i = 0; i < input.byteLength; i++) {
            out[2 * i] = buf[i] >> 4;
            out[2 * i + 1] = buf[i] & 15;
        }
        return out;
    }

    InitializeThree = (data) => {


        var gridSizeX = 999;
        var gridSizeY = 999;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);


        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        var controls = new (<any>THREE).TrackballControls(camera);

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [65, 83, 68];

        controls.addEventListener('change', render);

        var geometry = new THREE.Geometry();
        var materials = [];

        var result = [];
        var colours = [];

        var colourMap = ["#FFFFFF", "#E4E4E4", "#888888", "#222222", "#FFA7D1", "#E50000", "#E59500", "#A06A42", "#E5D900", "#94E044", "#02BE01", "#00D3DD", "#0083C7", "#0000EA", "#CF6EE4", "#820080"];


        for (var halfX = 0; halfX < 1000; halfX++) {
            for (var y = 0; y < 2000; y++) {

                var x = data[4 + (500 * y + halfX)];


                result.push(
                    { x: halfX * 2, y: y, colour: colourMap[x >> 4] },
                    { x: (halfX * 2) + 1, y: y, colour: colourMap[x & 0x0F] },
                );
            }
        }
        
        for (var m = 0; m < result.length; m++) {
            var res = result[m];

            if (res.x == 0 && res.y == 0)
                console.log(res)

            var vertex = new THREE.Vector3();
            vertex.x = Math.floor(res.x / 2);
            vertex.y = Math.floor(-res.y / 2);
            vertex.z = 0;

            colours[m] = new THREE.Color(res.colour);
            geometry.vertices.push(vertex);
        }


        var material = new THREE.PointsMaterial({ size: 2, vertexColors: THREE.VertexColors });
        var pointCloud = new THREE.Points(geometry, material);
        geometry.colors = colours;
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-500, 500, 0));
        scene.add(pointCloud);

        camera.position.z = 1000;

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
        }
        function render() {
            renderer.render(scene, camera);
        }

        animate();
    }
}

export = new Index();