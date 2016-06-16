# OTA Image Server
This is an OTA firmware image server for CC2650-based devices running Contiki.  This server is an incredibly simple CoAP server.  It reads the OTA image file `ota-image-example.bin`, and serves it in chunks using CoAP's blockwise data transfer mechanism.

>  Please note this server will not automatically work with any .bin file.  You must specifically compile your Contiki app to be an OTA image, with associated metadata (version number, UUID, CRC checksum).

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
The CoAP server can be made to listen using IPv6 or IPv4 by changing the following line in `ota-server.js`:

```js
var server = coap.createServer({ type: 'udp6' });
```

To use IPv4 hostnames (e.g. `127.0.0.1`), just use `udp4` in lieu of `udp6`.
