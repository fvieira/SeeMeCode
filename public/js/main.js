var Buffer = require('buffer').Buffer;
var io = require('socket.io-client');
var diff_match_patch=require('googlediff');
var zlib = require('zlib');

var socket;
var code = document.getElementsByTagName('code')[0];
var current_contents;
var dmp = new diff_match_patch();

function init() {
    socket = io.connect('/', { transports: ['websocket'] });

    // Start listening for events
    setEventHandlers();
}

function setEventHandlers() {
    socket.on('connect', onSocketConnected);
    socket.on('disconnect', onSocketDisconnect);
    socket.on('file_contents', onFileContents);
    socket.on('file_patches', onFilePatches);
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

function onFileContents(data) {
    console.log('Got file contents');

    var compressed_buffer = new Buffer(data.content, 'base64');
    zlib.inflate(compressed_buffer, function(err, buffer) {
        if (!err) {
            current_contents = buffer.toString();
            code = replaceHtml(code, hljs.highlightAuto(current_contents).value);
        } else {
            console.log(err);
        }
    });
}

function onFilePatches(data) {
    console.log('Got file patches');
    var patches = dmp.patch_fromText(data.patches);
    current_contents = dmp.patch_apply(patches, current_contents)[0];

    code = replaceHtml(code, hljs.highlightAuto(current_contents).value);
    console.log('Finished replacing html');
}

function replaceHtml(el, html) {
    // This is supposed to be faster than simply setting the innerHTML,
    // but I haven't had the time to benchmark it...

    var oldEl = typeof el === 'string' ? document.getElementById(el) : el;
    /*@cc_on // Pure innerHTML is slightly faster in IE
        oldEl.innerHTML = html;
        return oldEl;
    @*/
    var newEl = oldEl.cloneNode(false);
    newEl.innerHTML = html;
    oldEl.parentNode.replaceChild(newEl, oldEl);
    /* Since we just removed the old element from the DOM, return a reference
    to the new element, which can be used to restore variable references. */
    return newEl;
}

init();
