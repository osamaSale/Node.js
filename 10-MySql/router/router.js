const express = require("express");
const { upload } = require("../connection/upload")
const { getUserList, register, deleteUser, editUser, search, singleUser, login } = require("../controller/users");
const { Validating } = require("../middlewares/users")
const router = express.Router();

// =========================  Router Users =================================== //


router.get("/users", getUserList)
router.get("/users/single/:id", singleUser)
router.post("/users", Validating)
router.put("/users", upload.single("image"), editUser)
router.delete("/users/:id", deleteUser)
router.get("/users/search/:name", search)
router.post("/users/login", login)








module.exports = router;
