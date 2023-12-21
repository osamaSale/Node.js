const express = require("express");
const { upload } = require("../connection/upload");
const { getAllUsers, createUser, editUser, updatePassword, login, searchUser, deleteUser } = require("../controller/users");

const router = express.Router();
/* ============================= Users ========================================= */
router.get("/users", getAllUsers)
router.post("/users", upload.single("image"), createUser)
router.delete("/users/:id", deleteUser)
router.put("/users", upload.single("image"), editUser)
router.put("/users/updatePassword", updatePassword)
router.post("/users/login", login)
router.get("/users/search/:name", searchUser)



module.exports = router;