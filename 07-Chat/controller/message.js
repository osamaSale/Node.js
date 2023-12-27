const connection = require("../connection/mysql")
const cloudinary = require("../connection/cloudinary");
const { error } = require("./error")
const createMessage = async (req, res) => {
  
    const chatId =req.body.chatId
    const senderId =req.body.senderId
    let text =req.body.text || req.file;
    let cloudinary_id = null;
    if (!text) {
        res.json(error("Enter your name"));
    } else {
        text = req.file
        if (text = req.file) {
            text = await cloudinary.uploader.upload(req.file.path, { folder: "Chat/message" });
            cloudinary_id = image?.public_id;
            text = image?.secure_url;
        } else {
            text = req.body.text
        }
        let sql = `INSERT INTO message (chatId, senderId ,text  ,cloudinary_id) 
        VALUES ('${chatId}', '${senderId}' ,'${text}' ,'${cloudinary_id}')`
        connection.query(sql, async (err, result) => {
            let data = { chatId: chatId, senderId: senderId, text: text,  cloudinary_id: cloudinary_id };

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