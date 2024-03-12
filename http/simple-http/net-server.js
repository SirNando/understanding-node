const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log(data.toString("utf-8"));
  });

  const response = Buffer.from(
    "504f5354202f6372656174652d706f737420485454502f312e310d0a436f6e74656e742d547970653a206170706c69636174696f6e2f6a736f6e0d0a6e616d653a206d61746961730d0a486f73743a206c6f63616c686f73743a343038300d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a436f6e74656e742d4c656e6774683a2035350d0a0d0a7b227469746c65223a225469746c65206f66206d7920706f7374222c22626f6479223a225468697320697320736f6d652074657874227d",
    "hex"
  );

  socket.write(response);
});

server.listen(4080, "127.0.0.1", () => {
  console.log("Server started on port " + server.address().address);
});
