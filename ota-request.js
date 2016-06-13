var coap = require('coap');

var req = coap.request('coap://[::1]/0/20')

// edit this to adjust max packet
req.setOption('Block2', new Buffer([0x2]))

req.on('response', function(res) {
  //res.pipe(process.stdout)
  console.log( res.payload )
  res.on('end', function() {
    process.exit(0)
  })
})

req.end()
