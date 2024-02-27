const net = require("net");

const socket = net.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
  const buff = Buffer.alloc(2);
  buff[0] = 2;
  buff[1] = 5;
  socket.write(buff);

  socket.destroy();
});
