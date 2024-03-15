const Pewter = require("../pewter");

const PORT = 4080;

const server = new Pewter();

server.route("GET", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("GET", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("GET", "/script.js", (req, res) => {
  res.sendFile("./public/script.js", "text/javascript");
});

server.route("PUT", "/upload", (req, res) => {
  res.status(200).sendFile("storage/image.png");
});

server.listen(PORT, () => {
  console.log(`Server started on localhost:${PORT}`);
});
