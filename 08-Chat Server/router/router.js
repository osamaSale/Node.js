const express = require("express");
const { upload } = require("../connection/upload");
const { getAllUsers, createUser, editUser, updatePassword, login, searchUser, deleteUser, findUserEmail } = require("../controller/users");
const { createChat, getAllChat } = require("../controller/chat");
const { createMessage, getMessages, deleteChatMessage } = require("../controller/message");
const { getAllChatGroup, getAllChatGroupUsers, createChatGroupMessage, getChatGroupMessage, CreateChatGroupUsers, createChatGroup, deleteChatGruopUser ,deleteChatGruopMessage, leaveChatGroupUser} = require("../controller/chatGroup");

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



/* ============================= Chat ========================================= */

router.get('/chat', getAllChat);
router.post('/chat', createChat);

//============================ Router Massage ============================== //

router.post('/massage', upload.single("image"), createMessage);
router.get('/massage', getMessages);
router.delete("/massage/:id", deleteChatMessage)

/* ============================= Chat Group ========================================= */
router.get('/chatGroup', getAllChatGroup);
router.post('/chatGroup', upload.single("image"), createChatGroup);
router.get('/chatGroupUsers', getAllChatGroupUsers);
router.post('/chatGroupUsers', CreateChatGroupUsers);
router.get('/chatGroupMessage', getChatGroupMessage);
router.post('/chatGroupMessage', upload.single("image"), createChatGroupMessage);
router.delete("/chatGroupUsers/:id", deleteChatGruopUser)
router.delete("/chatGroupMessage/:id", deleteChatGruopMessage)
router.post("/chatGroupUserleave", leaveChatGroupUser)
module.exports = router;