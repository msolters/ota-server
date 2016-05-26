var http = require('http');

var server = http.createServer();

server.on('request', function(req, res) {
  console.log( req );
  res.writeHead( 200, {'Content-Type': 'application/octet-stream'} );
  var bin_data = new Uint8Array("hello world");
  res.end(bin_data);
});

server.on('listening', function() {
  console.log("OTA server listening on http://" + this.address().address + ":" + this.address().port + "/");
});

server.listen(3003, 'bbbb::1');
