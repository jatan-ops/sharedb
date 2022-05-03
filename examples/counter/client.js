var ReconnectingWebSocket = require('reconnecting-websocket');
var sharedb = require('sharedb/lib/client');

var socket = new ReconnectingWebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

var doc = connection.get('examples5', 'counter');

doc.subscribe(function() {
  console.log('subscribed to doc')
  showNumbers()
});

doc.on('op', function(op, source) {
  // console.log('op: ', op)
  console.log('source: ', source)
  showNumbers()
});

function showNumbers() {  
  document.querySelector('#num-clicks').textContent = doc.data.public;
};

function increment() {
  const op = [{p: ['public'], od: doc.data.public, oi: !doc.data.public}]
  doc.submitOp(op)
}

global.increment = increment;