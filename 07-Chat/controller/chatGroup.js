const connection = require("../connection/mysql")
const cloudinary = require("../connection/cloudinary");
const { error } = require("./error")

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

// ============================  get Chat Group  =================================== //
const getAllChatGroup = (req, res) => {
    let sql = `select * from chatGroup`
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else {
            res.json({ massage: "Successfully", status: 200, result: result })
        }
    })
}
// ============================  Create  Chat Group  =================================== //

const createChatGroup = (req, res) => {
    let userId = req.body.userId
    let name = req.body.name
    let purpose = req.body.purpose
    let image = req.file
    let cloudinary_id = null;
    let sql = `select * from users where id = '${userId}'`
    connection.query(sql, async (err, result) => {
        let user = result.find((u) => u.id === parseInt(userId));
        if (user === undefined) {
            res.json({ massage: "no user id", status: 201 });
        } else {
            if (name === "") {
                res.json(error("Enter your name"));
            } else if (!image) {
                res.json(error("Enter your Image"));
            } else {
                image = req.file
                if (image = req.file) {
                    image = await cloudinary.uploader.upload(req.file.path, { folder: "Chat/Chat Group" });
                    cloudinary_id = image?.public_id;
                    image = image?.secure_url;
                } else {
                    image = req.body.image
                }
                let sql = `INSERT INTO chatGroup (userId,nameAdmin,imageAdmin,name,image,purpose,cloudinary_id)
                VALUES('${userId}','${user.name}','${user.image}','${name}','${image}' ,'${purpose}' ,'${cloudinary_id}')`
                connection.query(sql, async (err, result) => {
                    if (err) {
                        let public_id = data.cloudinary_id === null ? "null" : data.cloudinary_id.replace('Chat/Chat Group/g', '')
                        await cloudinary.uploader.destroy(public_id).then((res) => { imageUrl = res });
                        res.json({ err: err, status: 500, error: "Internal Server Error" });
                    } else {
                        let sql = `INSERT INTO chatGroupUsers (groupId,userId,name,email,image,phone,bio)
                        VALUES('${result.insertId}','${userId}','${user.name}','${user.email}','${user.image}','${user.phone}' ,'${user.bio}')`
                        connection.query(sql, async (err, result) => {
                            if (err) {
                                res.json({ err: err, status: 500, error: "Internal Server Error" });
                            } else {
                                res.json({ massage: "successfully Create Chat Group", status: 200 })
                            }

                        })
                    }
                })
            }
        }
    })
}
// ============================  Get Chat Users  =================================== //

const getAllChatGroupUsers = (req, res) => {
    let sql = `select * from chatGroupUsers`
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else {
            res.json({ massage: "Successfully", status: 200, result: result })
        }
    })
}

// ============================  Create Chat Group Users  =================================== //

const CreateChatGroupUsers = (req, res) => {
    const groupId = req.body.groupId
    const userId = req.body.userId
    let sql = `select * from users where id = '${userId}'`

    connection.query(sql, (err, result) => {
        const user = result.find((u) => u.id === parseInt(userId))
        if (user === undefined) {
            res.json({ massage: "no user id", status: 201 });
        } else {
            let sql = `INSERT INTO chatGroupUsers (groupId , userId , name , email , image , phone , bio) 
            VALUES('${groupId}' , '${userId}'  , '${user.name}' , '${user.email}' , '${user.image}' , '${user.phone}' , '${user.bio}')`
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, error: "Internal Server Error" });
                } else {
                    res.json({ massage: "Successfully", status: 200 })
                }
            })
        }
    })
}

// ============================  chat Group Message  =================================== //


const getChatGroupMessage = (req, res) => {
    let sql = `select * from chatGroupMessage`
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else {
            res.json({ massage: "Successfully", status: 200, result: result })
        }
    })
}

// ============================ Create Chat Group Message  =================================== //


const createChatGroupMessage = (req, res) => {
    let groupId = req.body.groupId
    let userId = req.body.userId
    let userName = req.body.userName
    let userImage = req.body.userImage
    let image = req.file;
    let text = req.body.text;
    let cloudinary_id = null;
    let date = new Date().toUTCString().slice(5, 16);
    let time = formatAMPM(new Date)
    let sql = `select * from chatGroup where id='${groupId}'`
    connection.query(sql, async (err, result) => {
        const chatGroup = result.find((e) => e.id === parseInt(groupId));
        if (chatGroup === undefined) {
            res.json({ massage: "no chat Group", status: 201 });
        } else {
            image = req.file
            if (image = req.file) {
                image = await cloudinary.uploader.upload(req.file.path, { folder: "Chat/Chat Group Message" });
                cloudinary_id = image?.public_id;
                image = image?.secure_url;
            } else {
                image = null
            }
            let sql = `INSERT INTO chatGroupMessage (groupId, userId ,userName , userImage , text , image ,date , time ,cloudinary_id) 
            VALUES ('${groupId}','${userId}','${userName}','${userImage}', '${text}' ,'${image}' ,'${date}' , '${time}' ,'${cloudinary_id}')`
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

module.exports = {
    getAllChatGroup,
    createChatGroup,
    getAllChatGroupUsers,
    CreateChatGroupUsers,
    getChatGroupMessage,
    createChatGroupMessage
};