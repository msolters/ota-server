var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer();
host = "::1";
port = 3003;

var firmware_binary = fs.readFileSync('ota-image-example.bin');
//console.log( firmware_binary.toString('hex') );
console.log( firmware_binary.length );

server.on('request', function(req, res) {
  // (1) Parse request arguments
  request_parts = url.parse( req.url );
  path_arguments = request_parts.path.split("/");
  var data_start_position = parseInt( path_arguments[1] );
  var data_length = parseInt( path_arguments[2] );
  console.log( "Requesting data:\t" + data_start_position + "\t" + (data_start_position+data_length) );

  if (data_start_position >= firmware_binary.length) {
    //  If there's no more firmware, just send back an empty page (0xff)!
    res.writeHead( 200, {'Content-Type': 'text/plain'} );
    res.end("EOF");
  } else {
    //  Make sure we don't read past the end of the firmware.
    var data_end_position = Math.min( (data_start_position + data_length), firmware_binary.length );
    data = firmware_binary.slice( data_start_position, data_end_position );
    res.writeHead( 200, {'Content-Type': 'application/octet-stream'} );
    res.end( data );
  }
});

server.on('listening', function() {
  console.log("OTA server listening on http://" + this.address().address + ":" + this.address().port + "/");
});

server.listen(port, host);
