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

  let data;
  const name = req.headers.name;

  req.on("data", (chunk) => {
    data = chunk.toString("utf8");
  });

  req.on("end", () => {
    data = JSON.parse(data);
    console.log(data.title);
    console.log(data.body);
    console.log(name);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: `Post with title '${data.title}' was created by ${name}`,
      })
    );
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
