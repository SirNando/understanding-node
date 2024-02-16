const { Writable } = require("stream");
const fs = require("fs");

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
  }

  // Runs after the constructor and halts other methods until it completes
  _construct(callback) {
    fs.open(this.fileName, "w", (error, fd) => {
      if (error) {
        // argument = there was an error
        callback(error);
      } else {
        this.fd = fd;
        // no argument = successful
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (error) => {
        if (error) {
          return callback(error);
        }

        this.chunks = [];
        this.chunksSize = 0;
        callback();
      });
    } else {
      callback();
    }
  }

  _final() {}

  _destroy() {}
}

const stream = new FileWriteStream({
  highWaterMark: 1800,
  fileName: "text.txt",
});
stream.write(Buffer.from("this is some string"));
stream.end(Buffer.from("Our last write"));

stream.on("drain", () => {});
