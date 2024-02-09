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

  async function deleteFile(path) {
    try {
      await fs.unlink(path);
      return console.log(`File at path ${path} was deleted`);
    } catch (error) {
      // file does not exist
      return console.log(`File ${path} was not found.`);
    }
  }

  async function renameFile(path, newPath) {
    try {
      await fs.rename(path, newPath);
      return console.log(`Renamed file ${path} to ${newPath}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        return console.log(
          "No file at this path to rename, or the destination does not exist"
        );
      } else {
        return console.log(
          `An error occurred when trying to remove the file: ${error}`
        );
      }
    }
  }

  async function addToFile(path, text) {
    try {
      await fs.appendFile(path, text);
      return console.log(`Added ${text} to file ${path}`);
    } catch (error) {
      return console.log(`File ${path} was not found`);
    }
  }

  // helpers
  function getArguments(string, startingPos) {
    return string.substring(startingPos.length + 1);
  }

  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

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

    if (command.startsWith(CREATE_FILE)) {
      // create a file <path>
      const filePath = getArguments(command, CREATE_FILE);
      createFile(filePath);
    } else if (command.startsWith(DELETE_FILE)) {
      // delete the file <path>
      const filePath = getArguments(command, DELETE_FILE);
      deleteFile(filePath);
    } else if (command.startsWith(RENAME_FILE)) {
      // rename the file <path> <new_path>
      const [path, newPath] = getArguments(command, RENAME_FILE).split(" ");
      renameFile(path, newPath);
    } else if (command.startsWith(ADD_TO_FILE)) {
      // add to the file <path> <text>
      const arguments = getArguments(command, ADD_TO_FILE);
      const path = arguments.split(" ")[0];
      const text = arguments.substring(path.length + 1);
      addToFile(path, text);
    }
  });

  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
