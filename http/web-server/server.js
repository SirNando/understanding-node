const http = require("http");
const fs = require("fs/promises");

const server = http.createServer();

server.on("request", async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.setHeader("Content-Type", "text/html");

    const fileHandle = await fs.open("./public/index.html", "r");
    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(res);
  }
});

server.listen(4080, "127.0.0.1", () => {
  console.log(
    `Server started on ${server.address().address}:${server.address().port}`
  );
});
