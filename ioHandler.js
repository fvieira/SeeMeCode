var util = require('util');

function ioHandler(socket) {
    util.log(util.format('Someone has connected: %s', socket.id));
    socket.on('disconnect', onDisconnect);
    socket.on('file_contents', onFileContents);
    socket.on('file_patches', onFilePatches);
}

function onDisconnect() {
    util.log(util.format('Someone has disconnected: %s', this.id));
}

function onFileContents(data) {
    util.log('Got file contents');
    this.manager.sockets.emit('file_contents', { content: data.content });
}

function onFilePatches(data) {
    util.log('Got file patches');
    this.manager.sockets.emit('file_patches', { patches: data.patches });
}

module.exports = ioHandler;
