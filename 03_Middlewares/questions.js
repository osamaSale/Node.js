console.log("Express Middlewares");
//Pulse Check
// 0 Create a new server using the code below and use it while solving the following questions, use Postman to check the answer.
const express = require("express");
const app = express();
const authRouter = express.Router();
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
app.use(authRouter);
// 4 Use the right builtin middleware to parse JSON payloads from the request.
app.use(express.json());
// 5 Create an application-level error-handling middleware that will be called if the users array is empty,the middleware should have the message No users, empty the array to test it out.
const arr = [];
app.get("/userse", logMethod, (req, res, next) => {
  if (arr.length === 0) {
    const newErr = new Error("No users");
    newErr.status = 404;
    res.json("No users");
    next(newErr);
  } else {
    res.json(users);
  }
});
//Practice
// 1 Create a new express router to handel all requests to /users, and use it in the application, the endpoint /users should return all users.
authRouter.get("/users", (req, res, next) => {
  res.json(users);
});
app.use(authRouter);
// 2 Add a new route /users/create that will add a new user to the users array, and create a middleware that will log the request body if found (use the correct HTTP method).
const logBody = (req, res, next) => {
  console.log("REQ.BODY: ", req.body);
  next();
};
app.post("/users/create", logBody, (req, res, next) => {
  users.push(req.body.newName);
  res.json(users);
});
// 3 Create a new express router to handel all requests to /products (use it in the app), and create a products array that has the following items keyboard, mouse and then add a route to update the items /products/update in the array, it should change on of the values with a new value.

const productRouter = express.Router();
const product = [
  { name: "keyboard", price: 7 },
  { name: "mouse", price: 1.5 },
];
const logPath = (req, res, next) => {
  console.log(req.path);
  next();
};

app.use(logPath);
productRouter.get("/products", (req, res, next) => {
  res.json(products);
});
productRouter.put("/products/update", (req, res, next) => {
  console.log("REQ.BODY: ", req.body);
  product.forEach((e, i) => {
    e.price += req.body.newPrice;
  });
  res.json(products);
});
app.use(productRouter);
// 5 Create an application-level error-handling middleware, that has the message of NOT FOUND and a status code of 404 and that will be called when trying to access unassigned endpoints.
app.all("*", (req, res, next) => {
  const newErr = new Error("NOT FOUND GET");
  newErr.status = 404;
  next(newErr);
});
const handleAllNotExist = (err, req, res, next) => {
  res.status(err.status).json({
    error: {
      message: err.message,
    },
  });
};
app.use(handleAllNotExist);
const port = 3000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
