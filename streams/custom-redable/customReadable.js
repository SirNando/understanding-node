const { Readable } = require("stream");
const fs = require("fs");

class FileReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (error, fd) => {
      if (error) return callback(error);
      this.fd = fd;
      callback();
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.fd, buff, 0, size, null, (error, bytesRead) => {
      if (error) return this.destroy(error);

      // null indicates the end of the stream
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => callback(err || error));
    } else {
      callback(error);
    }
  }
}

const stream = new FileReadStream({ fileName: "text.txt" });

stream.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});

stream.on("end", () => {
  console.log("Stream is done reading.");
});
