const connection = require("../connection/mysql")



// ============================  Create Chat  =================================== //
const getAllChat = (req, res) => {
    let data = []
    let sql = `select * from chat`
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else {
            
            data = { chat: result }
            let sql = `select * from message`
            connection.query(sql, (err, result) => {
                data.chat?.forEach((chat) => {
                    chat.mass = result ? result[result.length -1] : []
                })
                res.json({ massage: "successfully", status: 200, result: data.chat })
            })
        }
    })
}
// ============================  Create Chat  =================================== //



const createChat = (req, res) => {
    let senderId = req.body.senderId;
    let receiverId = req.body.receiverId;
    let sql = `select * from users where id in ('${senderId}', '${receiverId}')`
    connection.query(sql, (err, result) => {
        let sender = result.find((u) => u.id === parseInt(senderId));
        let receiver = result.find((u) => u.id === parseInt(receiverId));
        if (sender === undefined && receiver === undefined) {
            res.json({ massage: "no user id", status: 201 });
        } else {
            let sql = `INSERT INTO chat (senderId,receiverId,
            senderName,senderEmail,senderImage,senderPhone,senderBio,
            receiverName,receiverEmail,receiverImage,receiverPhone,receiverBio)
                VALUES ('${senderId}','${receiverId}',
                '${sender.name}','${sender.email}','${sender.image}','${sender.phone}','${sender.bio}', 
                '${receiver.name}','${receiver.email}','${receiver.image}','${receiver.phone}','${receiver.bio}' 
                )`
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


module.exports = { createChat, getAllChat };