const connection = require("../connection/mysql")
const cloudinary = require("../connection/cloudinary");
const { error } = require("./error")
const createMessage = async (req, res) => {

    const chatId = req.body.chatId
    const senderId = req.body.senderId
    const receiverId = req.body.receiverId
    let text = req.body.text || req.file;
    let cloudinary_id = null;
    let sql = `select * from users where id in ('${senderId}', '${receiverId}')`
    connection.query(sql, (err, result) => {
        let sender = result.find((u) => u.id === parseInt(senderId));
        let receiver = result.find((u) => u.id === parseInt(receiverId));
        if (sender === undefined && receiver === undefined) {
            res.json({ massage: "no user id", status: 201 });
        } else {
            if (!text) {
                res.json(error("Enter your text"));
            } else {
                text = req.body.text
                
            }
            let sql = `INSERT INTO message (chatId, senderId , receiverId ,senderName , senderImage , receiverName , receiverImage ,text ,cloudinary_id) 
            VALUES ('${chatId}', '${senderId}' , '${receiverId}' ,'${sender.name}' ,'${sender.image}' ,  '${receiver.name}' ,'${receiver.image}' ,'${text}' ,'${cloudinary_id}')`
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, error: "Internal Server Error" });
                } else {
                    res.json({ status: 200, massage: "Successfully" });
                }
            })
        }
    })
}

const getMessages = async (req, res) => {
    const chatId = req.params.chatId;
    let sql = `select * from message `
    connection.query(sql, (err, result) => {
        /*  const chatId = result.find((e) => e.chatId); */
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else {
            res.json({ massage: "successfully", status: 200, result: result })
        }
    })
};
module.exports = { createMessage, getMessages }