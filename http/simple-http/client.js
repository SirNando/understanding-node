const http = require("http");

const agent = new http.Agent({ keepAlive: true });

const request = http.request({
  agent: agent,
  hostname: "localhost",
  port: 4080,
  method: "POST",
  path: "/create-post",
  headers: {
    "Content-Type": "application/json",
    name: "matias",
  },
});

// event emitted only once
request.on("response", (response) => {
  console.log("----- STATUS: -----");
  console.log(response.statusCode);

  console.log("----- HEADERS: -----");
  console.log(response.headers);

  console.log("----- BODY: -----");
  response.on("data", (chunk) => {
    console.log(chunk.toString("utf8"));
  });

  response.on("end", () => {
    console.log("End of response");
  });
});

request.end(
  JSON.stringify({ title: "Title of my post", body: "This is some text" })
);
