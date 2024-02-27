const net = require("net");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = net.createConnection(
  { host: "127.0.0.1", port: 3008 },
  async () => {
    console.log("Connected to the server.");

    const message = await rl.question("Enter a message:");

    socket.write(message);
  }
);

socket.on("data", (data) => {
  console.log(data.toString("utf-8"));
});

socket.on("end", () => {
  console.log("Connection was ended");
});
