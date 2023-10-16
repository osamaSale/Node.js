console.log("Express Middlewares");
/*
Type Express middlewares :> 
  
  1- Application-level middlewares
  2- Built-in middlewares
  3- Router-level middlewares
*/
const express = require("express");
const app = express();

//An example of a middleware:
app.use(express.json());
const ourMiddleware = (req, res, next) => {
  const name = req.body.name;
  if (name === "John") {
    // next();
  }
  res.send("Invalid Name");
};
app.post("/create/item", ourMiddleware, (req, res) => {
  res.send("test create/items endpoint");
});

//Application-Level Middlewares

app.use((req, res, next) => {
  console.log("Hello world");
  // next();
});

app.use("/users", (req, res, next) => {
  console.log(req.method);
  //next();
});

// Builtin Middlewares

// express.static() is a middleware that serves static assets such as HTML files, images, etc
app.use(express.static("public"));

// express.json() is a middleware that parses incoming requests with JSON payloads
app.use(express.json());

// Router-Level Middlewares

const authRouter = express.Router();

const methodType = (req, res, next) => {
  console.log(req.method);
  //next();
};
authRouter.post("/login", methodType, (req, res) => {
  res.send("Login successful");
});

app.use("/auth", authRouter); //http://localhost:3000/auth/login

//Error-handling middleware

app.get("/error", (req, res, next) => {
  // create a new error
  const err = new Error("Internal server error");
  err.status = 500;
  // pass it to next
  next(err);
});

app.use((err, req, res, next) => {
  // set the status code
  res.status(err.status);
  // send the response in JSON format
  res.json({
    error: {
      status: err.status,
      message: err.message,
    },
  });
});

//Third-Party middleware

const morgan = require("morgan");
//morgan is used to log information in the console
app.use(morgan("default"));
//default it can long information about the incoming requests
app.get("/morgan", (req, res, next) => {
  res.send("Testing endpoint");
});

const users = [{ name: "John", name: "Mark" }];

// 1 Create a middleware function logUsers that logs the users array then invokes the next middleware.
const logUsers = (req, res, next) => {
  res.json(users);
};
app.get("/users", logUsers, (req, res, next) => {
  res.json(users);
  next();
});

// 2 Use the middleware as an application-level middleware.
app.use((req, res, next) => {
  console.log("Hello world");
  next();
});

app.use("/user", (req, res, next) => {
  console.log(users);
  next();
});

// 3 Create a middleware function logMethod that logs the HTTP method and use it on the /users route.

const logMethod = (req, res, next) => {
  console.log(req.method);
  next();
};
authRouter.get("/UsersLog", logMethod, (req, res, next) => {
  res.json("Test Router");
  next();
});

// 4 Use the right builtin middleware to parse JSON payloads from the request.
app.use(express.json());


app.use(authRouter);
const port = 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
