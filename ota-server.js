var http = require('http');
var coap = require('coap');
var url = require('url');
var fs = require('fs');

var server = coap.createServer({ type: 'udp6' });

//  Configure the firmware to be served OTA
var firmware_binary = fs.readFileSync( process.argv[2] );

//  Here's where we process HTTP requests for chunks of the firmware_binary
server.on('request', function(req, res) {
  // (1) Parse URL path to obtain the data_start and data_length parameters
  console.log("Received CoAP request: " + req.url);
  request_parts = url.parse( req.url );
  path_arguments = request_parts.path.split("/");
  var data_start_position = parseInt( path_arguments[1] );
  var data_length = parseInt( path_arguments[2] );
  console.log( "Requesting data:\t" + data_start_position + "\t" + (data_start_position+data_length) );

  if (data_start_position >= firmware_binary.length) {
    //  If there's no more firmware, just send back an EOF message!
    console.log("\tFirmware Binary: Reached End Of File.");
    res.end("EOF");
  } else {
    //  Make sure we don't read past the end of the firmware.
    var data_end_position = Math.min( (data_start_position + data_length), firmware_binary.length );
    data = firmware_binary.slice( data_start_position, data_end_position );
    console.log("\tSending " + data.length + " bytes.");
    res.end( data );
  }
});

server.on('listening', function() {

});

server.listen( function() {
  console.log("OTA server listening on coap://[::1]:5683");
});
