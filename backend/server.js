//import modules

const http = require('http'); 

const hostname = '127.0.0.1';
const port = 3000;

//Creating Server
const server = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

//Listen and Response
server.listen(port, hostname, function() {
  console.log('Server running at http://'+ hostname + ':' + port + '/');
});