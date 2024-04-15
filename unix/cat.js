// outputs the contents of a file using streams
// it will output to stdout by default

const fs = require("fs");
const { stdin, stdout, stderr, argv } = require("process");

const filePath = process.argv[2];

if (filePath) {
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(stdout);
  fileStream.on("end", () => {
    exit(0);
  });
} else {
  stdin.on("data", (data) => {
    stdout.write(data.toString("utf-8").toUpperCase());
  });
}
