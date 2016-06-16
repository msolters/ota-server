var coap = require('coap');
var url = require('url');
var fs = require('fs');

var server = coap.createServer({ type: 'udp6' });

//  Configure the firmware to be served OTA
var firmware_binary = fs.readFileSync( process.argv[2] );

//  Here's where we process CoAP requests for chunks of the firmware_binary
server.on('request', function(req, res) {
  // (1) Parse URL path to see if this is an OTA request
  console.log("Received CoAP request: " + req.url);
  request_parts = url.parse( req.url );
  path_arguments = request_parts.path.split("/");
  
  if (path_arguments[1] == "ota") {
    // (2) Determine the starting address of this OTA download request
    data_start = req.payload.readUInt32LE(0);
    console.log("Requesting firmware starting from firmware address " + data_start);
    
    // (3) Don't send data if the request is beyond the size of the OTA image
    if ( data_start <= firmware_binary.length ) {
      res.end( firmware_binary.slice(data_start, firmware_binary.length) );
    }
    return;
  }

});

server.listen( function() {
  console.log("OTA server listening on coap://[::1]:5683");
});
