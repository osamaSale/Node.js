const express = require("express");
const { getUserList, register, deleteUser, editUser, search, singleUser, login } = require("../controller/users");
const router = express.Router();
router.get("/users", getUserList)
router.get("/users/single/:id", singleUser)
router.post("/users", register)
module.exports = router;


