var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer();
//  Our OTA server will use IPv6 address bbbb::1, port 3003
//  Feel free to use any IPv4 or IPv6 address that your nodes can resolve!
host = "bbbb::1";
port = 3003;

//  Configure the firmware to be served OTA
var firmware_binary = fs.readFileSync( process.argv[2] );

//  Here's where we process HTTP requests for chunks of the firmware_binary
server.on('request', function(req, res) {
  // (1) Parse URL path to obtain the data_start and data_length parameters
  request_parts = url.parse( req.url );
  path_arguments = request_parts.path.split("/");
  var data_start_position = parseInt( path_arguments[1] );
  var data_length = parseInt( path_arguments[2] );
  console.log( "Requesting data:\t" + data_start_position + "\t" + (data_start_position+data_length) );

  if (data_start_position >= firmware_binary.length) {
    //  If there's no more firmware, just send back an EOF message!
    console.log("\tFirmware Binary: Reached End Of File.");
    res.writeHead( 200, {'Content-Type': 'text/plain'} );
    res.end("EOF");
  } else {
    //  Make sure we don't read past the end of the firmware.
    var data_end_position = Math.min( (data_start_position + data_length), firmware_binary.length );
    data = firmware_binary.slice( data_start_position, data_end_position );
    console.log("\tSending " + data.length + " bytes.");
    res.writeHead( 200, {'Content-Type': 'application/octet-stream'} );
    res.end( data );
  }
});

server.on('listening', function() {
  console.log("OTA server listening on http://" + this.address().address + ":" + this.address().port + "/");
});

server.listen(port, host);
