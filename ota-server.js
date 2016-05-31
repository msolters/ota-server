var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer();
//  Our OTA server will use IPv6 address bbbb::1, port 3003
//  Feel free to use any IPv4 or IPv6 address that your nodes can resolve!
host = "bbbb::1";
port = 3003;

//  Read the OTA binary into a buffer to be served on request
var firmware_binary = fs.readFileSync('ota-image-example.bin');

//  Here's where we process HTTP requests for chunks of the firmware_binary
server.on('request', function(req, res) {
  // (1) Parse URL path to obtain the data_start and data_length parameters
  request_parts = url.parse( req.url );
  path_arguments = request_parts.path.split("/");
  
  if ( path_arguments[1] == "metadata" ) {
    metadata = new Buffer( 16 );
    metadata.writeUInt16LE( 0x0000, 0 ); // crc
    metadata.writeUInt16LE( 0x0000, 2 ); // crc shadow
    metadata.writeUInt32LE( firmware_binary.length, 4 ); // binary size
    metadata.writeUInt16LE( 0x1, 12 ); // version
    metadata.writeUInt32LE( 0xabcd, 8 ); // uuid
    metadata.writeUInt16LE( 0x0, 14 ); // 4-byte alignment
    
    console.log( metadata );
    res.writeHead( 200, {'Content-Type': 'application/octet-stream'} );
    res.end( metadata );
  } else {
    var data_start_position = parseInt( path_arguments[1] );
    var data_length = parseInt( path_arguments[2] );
    console.log( "Requesting data:\t" + data_start_position + "\t" + (data_start_position+data_length) );

    if (data_start_position >= firmware_binary.length) {
      //  If there's no more firmware, just send back an empty page (0xff)!
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
  }
});

server.on('listening', function() {
  console.log("OTA server listening on http://" + this.address().address + ":" + this.address().port + "/");
});

server.listen(port, host);
