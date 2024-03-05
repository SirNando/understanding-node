const dgram = require("dgram");

const receiver = dgram.createSocket("udp4");
const HOST = "127.0.0.1";
const PORT = 4080;

receiver.on("message", (message, remoteInfo) => {
  console.log(
    `Server got: ${message} from ${remoteInfo.address}:${remoteInfo.port}`
  );
});

receiver.bind(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}`);
});
