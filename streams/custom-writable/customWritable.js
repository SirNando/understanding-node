const { Writable } = require("stream");
const fs = require("fs");

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.writesCount = 0;
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
        ++this.writesCount;
        callback();
      });
    } else {
      callback();
    }
  }

  // runs after stream is done
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (error) => {
      if (error) return callback(error);

      this.chunks = [];
      ++this.writesCount;
      callback();
    });
  }

  // runs after final
  _destroy(error, callback) {
    console.log("Number of writes: ", this.writesCount);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

console.time("writeMany");

let i = 0;
let numberOfWrites = 1000000;

const stream = new FileWriteStream({
  fileName: "text.txt",
});

async function writeMany() {
  while (i < numberOfWrites) {
    const buff = Buffer.from(` ${i} `, "utf-8");

    // this is our last write
    if (i === numberOfWrites - 1) {
      return stream.end(buff);
    }

    // if stream.write returns false, stop the loop
    if (!stream.write(buff)) break;

    i++;
  }
}

writeMany();

stream.on("drain", () => {
  writeMany();
});

stream.on("finish", () => {
  console.timeEnd("writeMany");
});
