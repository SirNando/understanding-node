const net = require("net");
const fs = require("fs/promises");

const server = net.createServer(() => {});

server.on("connection", (socket) => {
  let fileHandle, fileStream, fileName;
  console.log("New connection");

  socket.on("data", async (data) => {
    let textData = data.toString("utf-8");
    if (textData.startsWith("filename:")) {
      fileName = textData.substring(textData.indexOf(":") + 1);
      return;
    }

    if (!fileHandle) {
      socket.pause(); // pause data from client
      fileHandle = await fs.open(`storage/${fileName}`, "w");
      fileStream = fileHandle.createWriteStream();

      fileStream.write(data);
      socket.resume(); // resume data from client

      fileStream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (!fileStream.write(data)) {
        socket.pause();
      }
    }
  });

  socket.on("end", () => {
    console.log("Connection ended");
    fileHandle.close();
  });
});

server.listen(5050, "::1", () => {
  console.log("Uploader server open on", server.address());
});
