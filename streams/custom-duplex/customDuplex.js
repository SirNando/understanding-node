const { Duplex } = require("stream");

const fs = require("fs");

class DuplexStream extends Duplex {
  constructor({
    writableHighWaterMark,
    readableHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({ writableHighWaterMark, readableHighWaterMark });
    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
    this.readFd = null;
    this.writeFd = null;
    this.chunks = [];
    this.chunksSize = 0;
  }

  _construct(callback) {
    fs.open(this.readFileName, "r", (error, readFd) => {
      if (error) return callback(error);
      this.readFd = readFd;

      fs.open(this.writeFileName, "w", (error, writeFd) => {
        if (error) callback(error);
        this.writeFd = writeFd;
        callback();
      });
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), (error) => {
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

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.readFd, buff, 0, size, null, (error, bytesRead) => {
      if (error) return this.destroy(error);

      // null indicates the end of the stream
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _final(callback) {
    fs.write(this.writeFd, Buffer.concat(this.chunks), (error) => {
      if (error) return callback(error);

      this.chunks = [];
      callback();
    });
  }

  _destroy(error, callback) {
    if (error) return callback(error);

    if (this.writeFd) {
      fs.close(this.writeFd, (writeErr) => {
        if (writeErr) return callback(writeErr);

        if (this.readFd) {
          fs.close(this.readFd, (readErr) => {
            if (readErr) return callback(readErr);
          });
        }
      });
    } else {
      callback(error);
    }
  }
}

const duplex = new DuplexStream({
  readFileName: "input.txt",
  writeFileName: "output.txt",
});

duplex.write(Buffer.from("This is a string 0"));
duplex.write(Buffer.from("This is a string 1"));
duplex.write(Buffer.from("This is a string 2"));
duplex.write(Buffer.from("This is a string 3"));
duplex.end(Buffer.from("End of write"));

duplex.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});
