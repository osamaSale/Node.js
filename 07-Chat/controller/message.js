const connection = require("../connection/mysql")
const cloudinary = require("../connection/cloudinary");

const createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    let cloudinary_id = null;
    let image = req.body.image || req.file;
    if (!image) {
        image = req.body.image
    } else {
        image = req.file
        if (image = req.file) {
            image = await cloudinary.uploader.upload(req.file.path, { folder: "Chat/message" });
            cloudinary_id = image?.public_id;
            image = image?.secure_url;
        } else {
            image = req.body.image
        }
        let sql = `INSERT INTO message (chatId, senderId ,text, image ) 
        VALUES ('${chatId}', '${senderId}' ,'${text}','${image}' ,'${cloudinary_id}')`
        connection.query(sql, async (err, result) => {
            let data = { chatId: chatId, senderId: senderId, text: text, image: image, cloudinary_id: cloudinary_id };

            if (err) {
                let public_id = data.cloudinary_id === null ? "null" : data.cloudinary_id.replace('Chat/users/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => { imageUrl = res });
                res.json({ err: err, status: 500, error: "Internal Server Error", massage: `You have entered invalid email ${data.email}` });
            } else {

                res.json({ massage: "Successfully", status: 200, result: data })
            }
        })
    }


}

const getMessages = async (req, res) => {
    const { chatId } = req.params;
    let sql = `select * from message where chatId = '${chatId}'`
    connection.query(sql, (err, result) => {
        const chatId = result.find((e) => e.chatId);
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (chatId === undefined) {
            res.json({ massage: "no user id", status: 201 });
        } else {
            res.json({ massage: "successfully", status: 200, result: chatId })
        }
    })
};
module.exports = { createMessage, getMessages }