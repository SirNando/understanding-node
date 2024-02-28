const net = require("net");
const { moveCursor } = require("readline");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function moveLine(dx, dy) {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
}

function clearLine(dir) {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
}

const socket = net.createConnection(
  { host: "127.0.0.1", port: 3008 },
  async () => {
    console.log("Connected to the server.");
    let id;

    async function askMessage(question) {
      const message = await rl.question(question);

      // clear the line where the cursor is
      await moveLine(0, -1);
      await clearLine(0);
      socket.write(`${id}-message-${message}`);
    }
    askMessage("Enter your name:");

    socket.on("data", async (data) => {
      console.log();
      await moveLine(0, -1);
      await clearLine(0);

      if (data.toString("utf-8").substring(0, 2) === "id") {
        // when we're getting the ID...
        id = data.toString("utf-8").substring(3);
        console.log(`Your ID is ${id}\n`);
      } else {
        console.log(data.toString("utf-8"));
      }

      askMessage("Enter a message:");
    });
  }
);

socket.on("end", () => {
  console.log("Connection was ended");
});
