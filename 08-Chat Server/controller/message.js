const connection = require("../connection/mysql")
const cloudinary = require("../connection/cloudinary");
const createMessage = async (req, res) => {
    const d = new Date();
    let chatId = req.body.chatId
    let senderId = req.body.senderId;
    let senderName = req.body.senderName;
    let senderImage = req.body.senderImage;
    let text = req.body.text;
    let date = new Date().toUTCString().slice(5, 16);
    let time = d.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    let image = req.file;
    let cloudinary_id = null;
    let sql = `select * from chat where id='${chatId}'`
    connection.query(sql, async (err, result) => {
        const chat = result.find((e) => e.id);
        if (chat === undefined) {
            res.json({ massage: "no chat", status: 201 });
        } else {
            image = req.file
            if (image = req.file) {
                image = await cloudinary.uploader.upload(req.file.path, { folder: "Chat Server/message" });
                cloudinary_id = image?.public_id;
                image = image?.secure_url;
            } else {
                image = null
            }
            let sql = `INSERT INTO message (chatId, senderId ,senderName , senderImage , text , image ,date , time ,cloudinary_id) 
              VALUES ('${chatId}', '${senderId}'  ,'${senderName}' ,'${senderImage}'   , '${text}' ,'${image}' ,'${date}' , '${time}' ,'${cloudinary_id}')`
            connection.query(sql, (err, result) => {
                let data = { chatId: chatId, senderId: senderId, text: text, date: date, image: image , time : time }
                if (err) {
                    console.log(err)
                    res.json({ err: err, status: 500, error: "Internal Server Error" });
                } else {
                    res.json({ status: 200, massage: "Successfully", result: data });
                }
            })

        }
    })

}


const getMessages = async (req, res) => {
    let sql = `select * from message `
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else {
            res.json({ massage: "successfully", status: 200, result: result })
        }
    })
};


// =========================  Delete chat  Message =================================== //
const deleteChatMessage = (req, res) => {
    const id = req.params.id;
    let sql = `select * from message where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const user = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" })
        } else if (user === undefined) {
            res.json({ massage: "no user id", status: 201 });
        } else {
            let public_id = user.cloudinary_id.replace('Chat Server/Chat Group Message/g', '')
            await cloudinary.uploader.destroy(public_id).then((res) => { imageUrl = res });

            let sql = `delete from message where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({  massage: "successfully Delete", status: 200 })
                }
            })
        }
    })
}
module.exports = { createMessage, getMessages  , deleteChatMessage}