const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUserId ,validateLogin} = require('../middlewares/validation');
const upload = require('../config/multer');

router.get('/', userController.getUsers);
router.get('/:id', validateUserId, userController.getUserById);
router.post('/', upload.single('image'), validateUser, userController.createUser);
router.put('/:id', validateUserId, upload.single('image'), validateUser, userController.updateUser);
router.delete('/:id', validateUserId, userController.deleteUser);
router.post('/login', validateLogin, userController.loginUser);
router.get('/search/:name', userController.searchUsers); 
module.exports = router;