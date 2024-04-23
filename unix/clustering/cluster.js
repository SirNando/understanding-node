const cluster = require("cluster");

if (cluster.isPrimary) {
  let requestCount = 0;
  setInterval(() => {
    console.log(`Total number of requests: ${requestCount}`);
  }, 5000);

  console.log(`This is the parent process with PID ${process.pid}`);
  const coresCount = require("os").availableParallelism();
  for (let i = 0; i < coresCount; i++) {
    const worker = cluster.fork();
    console.log(
      `Parent process spawned a new child process with PID ${worker.process.pid}`
    );
  }

  cluster.on("message", (worker, message) => {
    if (message?.action === "request") {
      requestCount++;
    }
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} ${signal || code} died. Restarting...`
    );
    cluster.fork();
  });
} else {
  require("./server.js");
}
