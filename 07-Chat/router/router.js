const express = require("express");
const { upload } = require("../connection/upload");
const { getAllUsers, createUser, editUser, updatePassword, login, searchUser, deleteUser, findUserEmail } = require("../controller/users");
const { getAllFriends, CreateFriends } = require("../controller/friends");
const { createChat } = require("../controller/chat");
const { createMessage, getMessages } = require("../controller/message");

const router = express.Router();
/* ============================= Users ========================================= */
router.get("/users", getAllUsers)
router.post("/users", upload.single("image"), createUser)
router.delete("/users/:id", deleteUser)
router.put("/users", upload.single("image"), editUser)
router.put("/users/updatePassword", updatePassword)
router.post("/users/findEmail", findUserEmail)
router.post("/users/login", login)
router.get("/users/search/:name", searchUser)

/* ============================= Friends ========================================= */

router.get("/friends", getAllFriends)
router.post("/friends", CreateFriends)


/* ============================= Chat ========================================= */

router.post('/chat', createChat);

//============================ Router Massage ============================== //

router.post('/massage',upload.single("text"), createMessage);
router.get('/massage', getMessages);


module.exports = router;