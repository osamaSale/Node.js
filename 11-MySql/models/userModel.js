const db = require('../config/database');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinaryConfig');

module.exports = {
    getUsers: async function () {
        const [rows] = await db.execute('SELECT * FROM users');
        return rows;
    },
    getUserById: async function (id) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    },
    createUser: async function (user) {
        const { name, email, password, phone, authorization, cloudinary_id = null, image_url = null } = user;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, phone, authorization, cloudinary_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, authorization, cloudinary_id, image_url]
        );
        return result.insertId;
    },
    updateUser: async function (id, user) {
        const { name, email, password, phone, authorization, cloudinary_id = null, image_url = null } = user;

        // Get the old user data to check the existing image URL and cloudinary_id
        const oldUser = await this.getUserById(id);
        if (!oldUser) {
            throw new Error('User not found');
        }
        // Delete the old image from Cloudinary if a new image is provided
        if (image_url && oldUser.cloudinary_id) {
            await cloudinary.uploader.destroy(oldUser.cloudinary_id);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            'UPDATE users SET name = ?, email = ?, password = ?, phone = ?, authorization = ?, cloudinary_id = ?, image = ? WHERE id = ?',
            [name, email, hashedPassword, phone, authorization, cloudinary_id, image_url, id]
        );
        return id;
    },
    deleteUser: async function (id) {
        // Retrieve the user first to get the image URL and cloudinary_id
        const user = await this.getUserById(id);
        if (user && user.cloudinary_id) {
            await cloudinary.uploader.destroy(user.cloudinary_id);
        }
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        return id;
    },
    findUserByEmail: async function (email) {
        const [rows] = await db.execute(`SELECT * FROM users WHERE email  = '${email}'`);
        console.log(rows)
        return rows[0];
    },
    validatePassword: async function (inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword);
    },
    searchUsersByName: async function (name) {
        const [rows] = await db.execute('SELECT * FROM users WHERE name LIKE ?', [`%${name}%`]);
        return rows;
    }
};
