const { spawn } = require("child_process");

const subprocess = spawn("dir");

subprocess.stdout.on("data", (data) => {
  console.log(data.toString());
});
