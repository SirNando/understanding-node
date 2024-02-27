const net = require("net");

const server = net.createServer();
const clients = [];

server.on("connection", (socket) => {
  console.log("A connection was made to the server");
  clients.push(socket);

  socket.on("data", (data) => {
    for (const client of clients) {
      client.write(data);
    }
  });

  
});

server.listen(3008, "127.0.0.1", () => {
  console.log(
    `opened server on ${server.address().address}:${server.address().port}`
  );
});
