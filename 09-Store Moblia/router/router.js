const express = require("express");
const { upload } = require("../connection/upload")
const { getAllUsers, singleUser, createUser, deleteUser, editUser, login } = require("../controller/users");
const router = express.Router();

router.get("/users", getAllUsers)
router.get("/users/single/:id", singleUser)
router.post("/users", upload.single("image"), createUser)
router.delete("/users/:id", deleteUser)
router.put("/users", upload.single("image"), editUser)
router.post("/users/login", login)
module.exports = router;