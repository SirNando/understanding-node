const Pewter = require("../pewter");

// { userId: 1, token: 234342 }
const SESSIONS = [];

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

// ------ Middleware ------ //
server.beforeEach((req, res, next) => {
  const routesToAuthenticate = [
    "GET /api/user",
    "PUT /api/user",
    "POS /api/posts",
    "DELETE /api/logout",
  ];

  if (routesToAuthenticate.indexOf(req.method + " " + req.url) !== -1) {
    // if we have a token cookie, save the userId to the req object
    if (req.headers.cookie) {
      const token = req.headers.cookie?.split("=")[1];
      console.log(token);
      const session = SESSIONS.find((session) => session.token === token);
      console.log(session);
      if (session) {
        console.log("Setting userId...");
        req.userId = session.userId;
        return next();
      }
    }
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
});

// parsing JSON body (only if size of body is smaller than the size of the highwatermark)
server.beforeEach((req, res, next) => {
  if (req.headers["content-type"] === "application/json") {
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      req.body = JSON.parse(body);
      return next();
    });
  } else {
    next();
  }
});

server.beforeEach((req, res, next) => {
  const routes = ["/", "/login", "/profile", "/new-post"];

  if (routes.indexOf(req.url) !== -1 && req.method === "GET") {
    return res.status(200).sendFile("public/index.html", "text/html");
  }

  next();
});

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

// Log user out
server.route("DELETE", "/api/logout", (req, res) => {});

// Log user in and give them a token
server.route("POST", "/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(
    (user) => user.username === username && user.password === password
  );
  if (user && user.password === password) {
    const token = Math.floor(Math.random() * 10000000000).toString();
    SESSIONS.push({ userId: user.id, token });

    res.setHeader("Set-Cookie", `token=${token}; Path=/`);

    res.status(200).json({ message: "Successfully logged in" });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Update user info
server.route("PUT", "/api/user", (req, res) => {});

// Create new post
server.route("POST", "/api/posts", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;

  console.log(req.userId);
  const post = {
    id: POSTS.length + 1,
    title,
    body,
    userId: req.userId,
  };

  POSTS.push(post);
  res.status(201).json(post);
});

// Send user info
server.route("GET", "/api/user", (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ username: user.username, name: user.name });
});

// ------ Start Server ------ //
server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
