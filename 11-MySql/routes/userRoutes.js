const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../config/multer');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', upload.single('image'), userController.createUser);
router.put('/:id',  upload.single('image'),  userController.updateUser);
router.delete('/:id',  userController.deleteUser);
router.post('/login',  userController.loginUser);
router.get('/search/:name', userController.searchUsers); 
module.exports = router;