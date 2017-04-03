"use strict";
var WebSocket = require("ws");
var request = require("request");
var Application = (function () {
    function Application() {
    }
    Application.prototype.initialize = function () {
        var express = require('express');
        var app = express();
        app.use(express.static('dist'));
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, responseType");
            next();
        });
        app.get('/getBitmap', function (req, res) {
            var options = {
                method: 'GET',
                url: 'https://www.reddit.com/api/place/board-bitmap',
                encoding: null,
                headers: { 'responseType': 'arrayBuffer' }
            };
            request(options, function (error, response, body) {
                res.send(body);
            });
        });
        app.listen(process.env.PORT || 3000, function () {
            console.log("Example app listening on port" + (process.env.PORT || 3000) + "!");
        });
    };
    return Application;
}());
function startWebSocketConnection() {
    var ws = new WebSocket('wss://ws-0d4e28f9a28f6dcae.wss.redditmedia.com/place?m=AQAAoT_hWAJ4yLXEt3cdX3qz_qwspTS1ilDStF9u28sgAlmM8tSy');
    ws.on('open', function open() {
    });
    ws.on('message', function incoming(data, flags) {
        console.log(data);
    });
}
module.exports = new Application().initialize();
//# sourceMappingURL=app.js.map