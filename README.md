# OTA Image Server
This is an OTA firmware image server for CC2650-based devices running Contiki.  This server is an incredibly simply HTTP server.  It simply reads the OTA image file `ota-image-example.bin`, and serves it in chunks over GET requests originating from Contiki nodes.

## Dependencies
This server is a Node.JS server so you will need the `node` binary to run it.  For most Debian distros the command to install NodeJS is

```bash
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```

For more information on other systems see the [NodeJS installation page](https://nodejs.org/en/download/package-manager/).

## Running
To run the server using the provided `ota-image-example` firmware, just execute:

```bash
node ota-server.js ota-image-example.bin
```

To serve your own firmware over OTA, simple replace `ota-image-example.bin` with your own OTA image.

## Configuration
Other than specifying what OTA image to serve, the only other configuration this server supports is changing the network interface that it will listen on.  By default, the server's host parameters are an IPv6 address of `bbbb::1` and port `3003`.  These values may be very easily changed by simply modifying the following lines in `ota-server.js`:

```js
host = "bbbb::1";
port = 3003;
```

You are not limited to using IPv6 and can use any IPv4/IPv6 host address that your Contiki nodes can resolve.
