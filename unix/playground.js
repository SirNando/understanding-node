const { spawn, exec } = require("child_process");

const subprocess = spawn("ls");

subprocess.stdout.on("data", (data) => {
  console.log(data.toString());
});

exec("ls -l", (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(stdout);

  console.log(`stderr: ${stderr}`);
});
