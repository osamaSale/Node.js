const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Mysql/users',
        format: async (req, file) => 'jpg',
        public_id: (req, file) => file.originalname,
    },
});

const upload = multer({ storage: storage });
module.exports = upload;