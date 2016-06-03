#!/bin/bash

# (1) Generate the CRC16 hash of the binary
CRC=`./generate-crc ota-image-example.bin`

# (2) Start the OTA server with the following properties:
#     Firmware binary is `ota-image-example.bin`
#     Firmware version is v2
#     Firmware UUID is 0xdeadbeef
#     Firmware CRC is the value computed above
node ota-server.js ota-image-example.bin 0x2 0xdeadbeef $CRC
