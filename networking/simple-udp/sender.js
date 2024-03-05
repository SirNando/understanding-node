const dgram = require("dgram");

const sender = dgram.createSocket("udp4");
const HOST = "127.0.0.1";
const PORT = 4080;

sender.send("hi there", PORT, HOST, () => {
  console.log("Sent a hi there message ñ");
  sender.close();
});
