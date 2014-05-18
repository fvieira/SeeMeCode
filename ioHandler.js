var util = require("util");

function ioHandler(socket) {
    util.log(util.format("Someone has connected: %s", socket.id));
    socket.on("disconnect", onDisconnect);
    socket.on("write", onWrite);
}

function onDisconnect() {
    util.log(util.format("Someone has disconnected: %s", this.id));
}

function onWrite(data) {
    util.log("Someone wrote");
    this.manager.sockets.emit("write", { content: data.content });
}

module.exports = ioHandler;
