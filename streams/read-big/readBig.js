const fsAsync = require("fs/promises");

async function readAsync() {
  console.time("readMany");
  const fileHandleRead = await fsAsync.open("source.txt", "r");
  const fileHandleWrite = await fsAsync.open("dest.txt", "w");

  const streamRead = fileHandleRead.createReadStream();
  const streamWrite = fileHandleWrite.createWriteStream();

  streamRead.on("data", (chunk) => {
    if (!streamWrite.write(chunk)) {
      streamRead.pause();
    }
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });

  console.timeEnd("readMany");
}

readAsync();
