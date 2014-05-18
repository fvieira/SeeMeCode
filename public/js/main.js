var io = require('socket.io-client');

var socket;
var code = document.getElementsByTagName('code')[0];

function init() {
    socket = io.connect('/', { transports: ['websocket'] });

    // Start listening for events
    setEventHandlers();
}

function setEventHandlers() {
    socket.on('connect', onSocketConnected);
    socket.on('disconnect', onSocketDisconnect);
    socket.on('write', onWrite);
}

function onSocketConnected() {
    console.log('Connected to socket server');
}

function onSocketDisconnect() {
    console.log('Disconnected from socket server');
}

function onWrite(data) {
    code.innerHTML = hljs.highlightAuto(data.content).value;
}

init();
