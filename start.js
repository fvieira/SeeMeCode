#!/usr/bin/env node
var debug = require('debug')('test');
var app = require('./app');
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
io.configure(function () {
    io.set("transports", ["websocket"]);
    io.set("log level", 2);
});
var ioHandler = require('./ioHandler');
io.on('connection', ioHandler);

server.listen(process.env.PORT || 3000, function() {
  debug('Express server listening on port ' + server.address().port);
});
