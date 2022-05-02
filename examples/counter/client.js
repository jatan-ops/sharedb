var ReconnectingWebSocket = require('reconnecting-websocket');
var sharedb = require('sharedb/lib/client');

var socket = new ReconnectingWebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

var doc = connection.get('examples4', 'counter');

doc.subscribe(showNumbers);
doc.on('op', showNumbers);

function showNumbers() {
  document.querySelector('#num-clicks').textContent = doc.data.public;
};

function increment() {
  // const op = json1.replaceOp(['public', false, true]) // json 1
  const op = [{p: ['public'], od: doc.data.public, oi: !doc.data.public}]
  doc.submitOp(op)
}

global.increment = increment;