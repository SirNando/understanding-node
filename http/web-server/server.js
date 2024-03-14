const Pewter = require("./pewter");

const PORT = 4080;

const server = new Pewter();

server.route("GET", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("PUT", "/upload", (req, res) => {
  res.status(200).sendFile("storage/image.png");
});

server.listen(PORT, () => {
  console.log(`Server started on localhost:${PORT}`);
});
