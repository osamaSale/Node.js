const connection = require("../connection/mysql")
const cloudinary = require("../connection/cloudinary");
const createMessage = async (req, res) => {

    let chatId = req.body.chatId
    const senderId = req.body.senderId;
    let text = req.body.text;
    let date = new Date().toUTCString().slice(5, 16);
    let image = req.file;
    let cloudinary_id = null;
    let sql = `select * from chat where id='${chatId}'`
    connection.query(sql, async (err, result) => {
           const chat = result.find((e) => e.id ); 
          if (chat === undefined) {
              res.json({ massage: "no chat", status: 201 });
          } else {
              image = req.file
              if (image = req.file) {
                  image = await cloudinary.uploader.upload(req.file.path, { folder: "Chat/message" });
                  cloudinary_id = image?.public_id;
                  image = image?.secure_url;
              } else {
                  image = null
              }
              let sql = `INSERT INTO message (chatId, senderId ,senderName , senderImage , text , image ,date ,cloudinary_id) 
              VALUES ('${chatId}', '${senderId}'  ,'${chat.senderName}' ,'${chat.senderImage}' ,  '${text}' ,'${image}' ,'${date}' ,'${cloudinary_id}')`
              connection.query(sql, (err, result) => {
               
                if (err) {
                      res.json({ err: err, status: 500, error: "Internal Server Error" });
                  } else {
                      res.json({ status: 200, massage: "Successfully" , result:chat });
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