const Pewter = require("../pewter");

const USERS = [
  { id: 1, name: "Liam Brown", username: "liam23", password: "string" },
  { id: 2, name: "Meredith Green", username: "merit.sky", password: "string" },
  { id: 3, name: "Ben Adams", username: "ben.poet", password: "string" },
];

const POSTS = [
  {
    id: 1,
    title: "This is a post title",
    body: "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    userId: 1,
  },
];

const PORT = 8000;

const server = new Pewter();

// ------ Files Routes ------ //

server.route("GET", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("GET", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("GET", "/script.js", (req, res) => {
  res.sendFile("./public/script.js", "text/javascript");
});

// ------ JSON Routes ------ //

// Send the list of all the posts that we have
server.route("GET", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    post.author = user.name;
    return post;
  });

  res.status(200).json(posts);
});

// ------ Login Routes ------ //
server.route("POST", "/api/login", (req, res) => {
  let body = "";
  req.on("data", (data) => {
    body += data.toString("utf8");
  });

  req.on("end", () => {
    body = JSON.parse(body);
    const { username, password } = body;
    const user = USERS.find(
      (user) => user.username === username && user.password === password
    );
    if (user && user.password === password) {
      res.status(200).json({message: "Successfully logged in"});
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });
});

// ------ Start Server ------ //
server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
