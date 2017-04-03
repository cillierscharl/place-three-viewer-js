define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ThreeApp = (function () {
        function ThreeApp() {
        }
        ThreeApp.prototype.initialize = function (data) {
            var width = 1000;
            var height = 1000;
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            var controls = new THREE.TrackballControls(camera);
            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 2;
            controls.panSpeed = 1.2;
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
            var colourCount = 0;
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height * 2; y++) {
                    var buff = data[4 + (500 * y + x)];
                    var xobj = { x: x * 2, y: y, colour: colourMap[buff >> 4] };
                    var yobj = { x: (x * 2) + 1, y: y, colour: colourMap[buff & 0x0F] };
                    var vertex = new THREE.Vector3();
                    vertex.x = Math.floor(xobj.x / 2);
                    vertex.y = Math.floor(-xobj.y / 2);
                    vertex.z = 0;
                    colours[colourCount++] = new THREE.Color(xobj.colour);
                    geometry.vertices.push(vertex);
                    var vertexFlip = new THREE.Vector3();
                    vertexFlip.x = Math.floor(xobj.x / 2);
                    vertexFlip.y = Math.floor(-xobj.y / 2);
                    vertexFlip.z = 0;
                    colours[colourCount++] = new THREE.Color(yobj.colour);
                    geometry.vertices.push(vertexFlip);
                }
            }
            var material = new THREE.PointsMaterial({ size: 2, vertexColors: THREE.VertexColors });
            var pointCloud = new THREE.Points(geometry, material);
            geometry.colors = colours;
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-width / 2, width / 2, 0));
            scene.add(pointCloud);
            camera.position.z = width;
            function animate() {
                requestAnimationFrame(animate);
                controls.update();
            }
            function render() {
                renderer.render(scene, camera);
            }
            animate();
        };
        return ThreeApp;
    }());
    exports.ThreeApp = ThreeApp;
});
//# sourceMappingURL=threeapp.js.map