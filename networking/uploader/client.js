const net = require("net");
const fs = require("fs/promises");
const path = require("path");
const process = require("process");

function updateLine(text) {
  process.stdout.clearLine(0, () => {
    process.stdout.moveCursor(0, -1, () => {
      console.log(text);
    });
  });
}

const filePath = process.argv[2];
if (!filePath) {
  console.log("Must specify pathname");
  return;
}

const fileName = path.basename(filePath);

const socket = net.createConnection({ host: "::1", port: 5050 }, async () => {
  const fileHandle = await fs.open(filePath, "r");
  const fileStream = fileHandle.createReadStream();
  const fileSize = (await fileHandle.stat()).size;
  let progress = 0;

  socket.write(`filename:${fileName}`);
  console.log(`Progress: ${progress}%`);

  // reading from the source file
  fileStream.on("data", (data) => {
    const newProgress = Math.floor((fileStream.bytesRead * 100) / fileSize);
    if (newProgress !== progress) {
      progress = newProgress;
      updateLine(`Progress: ${progress}%`);
    }

    if (!socket.write(data)) {
      fileStream.pause();
    }
  });

  socket.on("drain", () => {
    fileStream.resume();
  });

  fileStream.on("end", () => {
    updateLine("File uploaded successfully");
    socket.end();
  });
});
