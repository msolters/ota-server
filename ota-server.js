var http = require('http');

host = "::1";
port = 3003;

var server = http.createServer();

server.on('request', function(req, res) {
  console.log( req );
  res.writeHead( 200, {'Content-Type': 'application/octet-stream'} );
  var bin_data = new Uint8Array([0, 80, 0, 32]); // this will be our .bin file
  res.end( new Buffer(bin_data, "binary") );
});

server.on('listening', function() {
  console.log("OTA server listening on http://" + this.address().address + ":" + this.address().port + "/");
});

server.listen(port, host);
