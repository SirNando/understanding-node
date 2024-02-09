const fs = require("fs/promises");
const { Buffer } = require("buffer");

(async () => {
  async function createFile(path) {
    try {
      // check if the file exists
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();

      // file exists
      return console.log(`The file ${path} already exists`);
    } catch (error) {
      // file does not exist
      const newFileHandle = await fs.open(path, "w");
      newFileHandle.write("Hi!");
      newFileHandle.close();
      return console.log("A new file was created");
    }
  }

  // commands
  const CREATE_FILE = "create a file";

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    // Get the size of the file
    const size = (await commandFileHandler.stat()).size;
    // allocate our buffer with the size of the file
    const buff = Buffer.alloc(size);
    // the location where we start writing to the buffer
    const offset = 0;
    // how many bytes we want to read
    const length = buff.byteLength;
    // the position that we want to start reading from
    const position = 0;
    // always read the file from beginning to end
    await commandFileHandler.read(buff, offset, length, position);

    // decode buffer to get command
    const command = buff.toString("utf-8");

    // create a file <path>
    if (command.startsWith(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      console.log(filePath);
      createFile(filePath);
    }
  });

  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
