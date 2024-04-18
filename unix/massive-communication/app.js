// This app reads numbers from a file and passes it to another app

const { argv } = require("process");
const { spawn } = require("child_process");
const fs = require("fs");

let filePath = argv[2];
if (!filePath) {
  filePath = "./dest.txt";
}

const numberFormatter = spawn("./number_formatter.exe", [filePath, "$", ","]);

numberFormatter.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

numberFormatter.stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);
});

numberFormatter.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});

const fileStream = fs.createReadStream("./src.txt");
fileStream.pipe(numberFormatter.stdin);
