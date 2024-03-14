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

  if (req.url === "/styles.css" && req.method === "GET") {
    res.setHeader("Content-Type", "text/css");

    const fileHandle = await fs.open("./public/styles.css", "r");
    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(res);
  }

  if (req.url === "/script.js" && req.method === "GET") {
    res.setHeader("Content-Type", "text/javascript");

    const fileHandle = await fs.open("./public/script.js", "r");
    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(res);
  }

  if (req.url === "/login" && req.method === "POST") {
    res.setHeader("Content-Type", "application/json");

    res.statusCode = 200;
    const body = {
      message: "Logging you in...",
    };

    res.end(JSON.stringify(body));
  }

  if (req.url === "/user" && req.method === "PUT") {
    res.setHeader("Content-Type", "application/json");

    res.statusCode = 401;
    const body = {
      message: "You first need to log in",
    };

    res.end(JSON.stringify(body));
  }

  // upload route
  if (req.url === "/upload" && req.method === "PUT") {
    res.setHeader("Content-Type", "application/json");

    const fileHandle = await fs.open("./storage/image.png", "w");
    const fileStream = fileHandle.createWriteStream();

    req.pipe(fileStream);

    req.on("end", () => {
      res.end(JSON.stringify({ message: "File uploaded" }));
    });
  }
});

server.listen(4080, "127.0.0.1", () => {
  console.log(
    `Server started on ${server.address().address}:${server.address().port}`
  );
});
