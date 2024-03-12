const net = require("net");

const socket = net.createConnection({ host: "127.0.0.1", port: 4080 }, () => {
  // this is literally a hex encoded head
  const head = Buffer.from(
    "504f5354202f6372656174652d706f737420485454502f312e310d0a436f6e74656e742d547970653a206170706c69636174696f6e2f6a736f6e0d0a6e616d653a206d61746961730d0a486f73743a206c6f63616c686f73743a343038300d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a436f6e74656e742d4c656e6774683a2035350d0a0d0a",
    "hex"
  );

  // this is literally a hex encoded body
  const body = Buffer.from(
    "7b227469746c65223a225469746c65206f66206d7920706f7374222c22626f6479223a225468697320697320736f6d652074657874227d",
    "hex"
  );

  socket.write(Buffer.concat([head, body]));
});

socket.on("data", (chunk) => {
  console.log("Received response:");
  console.log(chunk.toString());
  socket.end();
});

socket.on("end", () => {
  console.log("Socket ended");
});
