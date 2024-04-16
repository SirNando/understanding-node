// This app gets a stream of numbers and adds a dollar sign ($) to them

const { stdin } = require("process");
const fs = require("fs");
const stream = require("stream");

const transformerStream = new stream.Transform({
  transform(chunk, encoding, callback) {
    let numbers = chunk
      .toString("utf-8")
      .split("  ")
      .map((number) => "$" + number)
      .join("  ");
    callback(null, numbers);
  },
});
const fileStream = fs.createWriteStream("./dest.txt");

stdin.pipe(transformerStream).pipe(fileStream);

stdin.on("end", () => {
  console.log("Finished reading from stdin");
});
