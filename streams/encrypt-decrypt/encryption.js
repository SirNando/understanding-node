// implements a transform stream that will encrypt data

const { Transform } = require("stream");
const fs = require("fs/promises");

class Encrypt extends Transform {
  constructor({ fileSize }) {
    super();
    this.size = fileSize;
    this.totalBytesRead = 0;
  }

  _transform(chunk, encoding, callback) {
    for (let element = 0; element < chunk.length; element++) {
      if (chunk[element] !== 255) chunk[element] += 1;
    }
    this.totalBytesRead += chunk.length;
    const newProgress = Math.round((this.totalBytesRead * 100) / this.size, 0);

    if (newProgress !== this.progress) {
      this.progress = newProgress;
      console.log(`Encrypted ${this.progress}%`);
    }
    callback(null, chunk);
  }
}

async function encryptor() {
  const readFileHandle = await fs.open("read.txt", "r");
  const writeFileHandle = await fs.open("encrypted.txt", "w");

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const fileSize = (await readFileHandle.stat()).size;
  const encrypt = new Encrypt({ fileSize });

  // we take our readstream, transforming it with encrypt, then sending it to writestream
  readStream.pipe(encrypt).pipe(writeStream);
}

encryptor();
