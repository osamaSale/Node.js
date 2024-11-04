const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
module.exports = {
    getUsers: async function (req, res) {
        try {
            const users = await userModel.getUsers();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },
    getUserById: async function (req, res) {
        const { id } = req.params;
        if(!id){
            return res.status(404).json({ message: 'User not found' });
        }
        try {
            const user = await userModel.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error osama' });
        }
    },
    createUser: async function (req, res) {
        let image_url = null;
        let cloudinary_id = null;
        if (req.file) {
            image_url = req.file.path; // Cloudinary URL
            cloudinary_id = req.file.filename; // Cloudinary public_id
        }
        if (!name || !email || !password || !phone || !authorization) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        try {
            const user = { name, email, password, phone, authorization, cloudinary_id, image_url };
            const userId = await userModel.createUser(user);
            res.status(201).json({ message: 'User created successfully', userId , users : await userModel.getUsers()});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },
    updateUser: async function (req, res) {
        const { id } = req.params;
        const { name, email, password, phone, authorization } = req.body;
        let image_url = null;
        let cloudinary_id = null;
        if (req.file) {
            image_url = req.file.path; // Cloudinary URL
            cloudinary_id = req.file.filename; // Cloudinary public_id
        }else{
            const oldUser = await userModel.getUserById(id);
            image_url = oldUser.image;
            cloudinary_id = oldUser.cloudinary_id;
        }
        if (!name || !email || !password || !phone || !authorization) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        try {
            const user = { name, email, password, phone, authorization, cloudinary_id, image_url };
            await userModel.updateUser(id, user);
            res.json({ message: 'User updated successfully', userId: id , users : await userModel.getUsers()});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },
    deleteUser: async function (req, res) {
        const { id } = req.params;
        try {
            await userModel.deleteUser(id);
            res.json({ message: 'User deleted successfully', userId: id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },
    loginUser: async function (req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: 'Email and password are required' });
        }else{
            try {
              
                let user = await userModel.findUserByEmail(email);
                console.log(email)
                console.log(user)
                if (!user) {
                    return res.status(400).json({ message: 'Invalid Email' });
                }else{
                const isPasswordValid = await userModel.validatePassword(password, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ message: 'Invalid Password' });
                }
            }
                const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token ,user});
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Server Error'  });
            }
        }
       
    },
    searchUsers: async function (req, res) {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({ message: 'Name query parameter is required' });
        }
        try {
            const users = await userModel.searchUsersByName(name);
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
};
