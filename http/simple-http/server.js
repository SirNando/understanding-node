const http = require("http");

const server = http.createServer();
const PORT = 4080;
const HOST = "127.0.0.1";

server.on("request", (req, res) => {
  console.log("----- METHOD: -----");
  console.log(req.method);

  console.log("----- URL: -----");
  console.log(req.url);

  console.log("----- HEADERS: -----");
  console.log(req.headers);

  console.log("----- BODY: -----");
  req.on("data", (chunk) => {
    console.log(chunk.toString("utf8"));
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
