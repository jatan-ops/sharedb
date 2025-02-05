var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');

var WebSocket = require('ws');

const db = require('sharedb-mongo')('mongodb://0.0.0.0:27017/test');
var backend = new ShareDB({db: db});

backend.use('apply', (context, next) => {
  // console.log('context: ', context.op)
  console.log('context: ', context.snapshot)
  next()
})

// createDoc(startServer);
startServer()

function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get('examples5', 'counter');
  // console.log('agent: ', connection.agent)
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {      
      doc.create({title: 'default title', contents: '', public: false}, callback);
      return;
    }
    callback();
  });
}

function startServer() {
  var app = express();
  app.use(express.static('static'));
  var server = http.createServer(app);

  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream); 
  });

  server.listen(8080);
  console.log('Listening on http://localhost:8080');
}

