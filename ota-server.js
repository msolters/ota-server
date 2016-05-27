var http = require('http');
var url = require('url');

host = "bbbb::1";
port = 3003;

var server = http.createServer();

var arr = [];
for (var i=0; i<0x1000; i++) {
  arr[i] = i%0xff;
}
var uarr = new Uint8Array( arr );

server.on('request', function(req, res) {
  // (1) Parse request arguments
  request_parts = url.parse( req.url );
  path_arguments = request_parts.path.split("/");
  var data_start_position = parseInt( path_arguments[1] );
  var data_length = parseInt( path_arguments[2] );
  console.log( "Return data from " + data_start_position + " to " + (data_start_position+data_length) );

  res.writeHead( 200, {'Content-Type': 'application/octet-stream'} );
  data = uarr.subarray( data_start_position, (data_start_position+data_length) ); 
  res.end( new Buffer(data, "binary") );
});

server.on('listening', function() {
  console.log("OTA server listening on http://" + this.address().address + ":" + this.address().port + "/");
});

server.listen(port, host);
