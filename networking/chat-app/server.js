const net = require("net");

const server = net.createServer();
const clients = [];

server.on("connection", (socket) => {
  console.log(`A connection was made`);
  clients.push(socket);

  function sendToAll(data) {
    clients.map((s) => {
      s.write(`${socket.username}: ${data}`);
    });
  }

  function decodeBuffer(data, option = "message") {
    const dataString = data.toString("utf-8");

    switch (option) {
      case "id": {
        return dataString.substring(0, dataString.indexOf("-"));
      }
      case "message": {
        return dataString.substring(dataString.indexOf("-message-") + 9);
      }
    }
  }

  const id = clients.length;
  socket.write(`id-${clients.length}`);
  socket.id = id;

  socket.on("data", (data) => {
    if (!socket.username) {
      socket.username = decodeBuffer(data, "message");
      return sendToAll("*joined chat*");
    }
    sendToAll(decodeBuffer(data, "message"));
  });

  socket.on("error", () => {
    sendToAll("*left chat*");
  });
});

server.listen(3008, "127.0.0.1", () => {
  console.log(
    `opened server on ${server.address().address}:${server.address().port}`
  );
});
