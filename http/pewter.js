// my simplified homemade alternative to expressjs
const http = require("http");
const fs = require("fs/promises");

class Pewter {
  constructor() {
    this.server = http.createServer();
    this.routes = {};

    this.server.on("request", (req, res) => {
      // send a file back to the client
      res.sendFile = async (path, mime) => {
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();
        res.setHeader("Content-Type", mime);

        fileStream.pipe(res);
        fileStream.on("end", () => {
          res.end();
        });
      };

      res.status = (statuscode) => {
        res.statusCode = statuscode;
        return res;
      };

      res.json = (content) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(content));
      };

      if (this.routes[req.method + req.url]) {
        this.routes[req.method + req.url](req, res);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    });
  }

  route(method, url, callback) {
    this.routes[method + url] = callback;
  }

  listen(port, callback) {
    this.server.listen(port, () => callback());
  }
}

module.exports = Pewter;
