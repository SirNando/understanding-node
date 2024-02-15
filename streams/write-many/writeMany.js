const fsAsync = require("node:fs/promises");
const { Buffer } = require("buffer");

const MILLION = 1000000;

// Execution Time: 8s
// CPU Usage: 100% (one core)
// Memory Usage: 50MB
async function writeAsync(times) {
  console.time("writeMany");
  const fileHandle = await fsAsync.open("test.txt", "w");

  for (let i = 0; i < times; i++) {
    await fileHandle.write(` ${i} `);
  }
  console.timeEnd("writeMany");
};

// Execution Time: 1.8s
// CPU Usage: 100% (one core)
// Memory Usage: 50MB
const fs = require("fs");

async function writeCallback(times) {
  console.time("writeMany");
  fs.open("test.txt", "w", (err, fd) => {
    for (let i = 0; i < times; i++) {
      const buff = Buffer.from(` ${i} `, "utf-8");
      fs.writeSync(fd, buff);
    }

    console.timeEnd("writeMany");
  });
};

// DON'T DO IT THIS WAY!!!!
// Execution Time: 270ms
// CPU Usage: 100% (one core)
// Memory Usage: 200MB
async function writeStream(times) {
  console.time("writeMany");
  const fileHandle = await fsAsync.open("test.txt", "w");

  const stream = fileHandle.createWriteStream();

  for (let i = 0; i < times; i++) {
    const buff = Buffer.from(` ${i} `, "utf-8");
    stream.write(buff);
  }
  console.timeEnd("writeMany");
};



// Execution Time: 300ms
// Memory Usage: 50MB
async function writeStreamOptimized(times) {
  console.time("writeMany");
  const fileHandle = await fsAsync.open("test.txt", "w");

  const stream = fileHandle.createWriteStream();

  console.log(stream.writableHighWaterMark);

  // const buff = Buffer.alloc(16383, "a");
  // console.log(stream.write(buff));
  // console.log(stream.write(Buffer.alloc(1, "a")));
  // console.log(stream.write(Buffer.alloc(1, "a")));
  // console.log(stream.write(Buffer.alloc(1, "a")));

  // console.log(stream.writableLength);

  // stream.on("drain", () => {
  //   console.log(stream.write(Buffer.alloc(16384, "a")));
  //   console.log(stream.writableLength);

  //   console.log("We are now safe to write more!");
  // });

  let i = 0;

  const numberOfWrites = times;

  const writeMany = () => {
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
  };

  writeMany();

  // resume our loop once our stream's internal buffer is emptied
  stream.on("drain", () => {
    // console.log("Drained!!!");
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    fileHandle.close();
  });
};

writeStreamOptimized(MILLION*10);