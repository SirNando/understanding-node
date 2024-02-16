const { error } = require("console");
const fs = require("fs/promises");
const { pipeline } = require("stream/promises");

async function copyFile(src, dst) {
  console.time("copy");
  const srcFile = await fs.open(src, "r");
  const destFile = await fs.open(dst, "w");

  let bytesRead = -1;

  while (bytesRead !== 0) {
    const readResult = await srcFile.read();
    bytesRead = readResult.bytesRead;

    if (bytesRead !== 16384) {
      const indexOfNotFilled = readResult.buffer.indexOf(0);
      const newBuffer = Buffer.alloc(indexOfNotFilled);
      readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
      destFile.write(newBuffer);
    } else {
      destFile.write(readResult.buffer);
    }
  }

  console.timeEnd("copy");
}

async function copyFileStream(src, dst) {
  console.time("copy-stream");
  const srcFile = await fs.open(src, "r");
  const destFile = await fs.open(dst, "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  readStream.pipe(writeStream);

  readStream.on("end", () => {
    console.timeEnd("copy-stream");
  });
}

async function copyFilePipeline(src, dst) {
  console.time("copy-pipeline");
  const srcFile = await fs.open(src, "r");
  const destFile = await fs.open(dst, "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  await pipeline(readStream, writeStream);
  console.timeEnd("copy-pipeline");
}

// copyFile("text-gb.txt", "dest-gb.txt");
// copyFile("text.txt", "dest.txt");
// copyFileStream("text.txt", "dest.txt");
copyFilePipeline("text.txt", "dest.txt");
