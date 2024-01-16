const connection = require("../connection/mysql")


// ============================  Get All friends  =================================== //


const getAllFriends = (req, res) => {

    let sql = 'select * from friends ORDER BY name'
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No friends Found" });
        } else {
            res.json({ status: 200, massage: "Successfully", result: result });
        }

    })
}
// ============================  Create friends  =================================== //


const CreateFriends = (req, res) => {
    let userId = req.body.userId;
    let friendId = req.body.friendId;
    let sql = `select * from users where id = ${friendId} `
    connection.query(sql, (err, result) => {
        const user = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (user === undefined) {
            res.json({ massage: "no user id", status: 201 });
        } else {
            let sql = `INSERT INTO friends (userId , friendId , name , email , image , phone , bio)
            VALUES ('${userId}','${friendId}' ,'${user.name}' , '${user.email}', '${user.image}' , '${user.phone}' , '${user.bio}' )`
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, error: "Internal Server Error" });
                } else {
                    res.json({ status: 200, massage: "Successfully", result: user });
                }
            })
        }
    })
}


// =========================  Search Users =================================== //

const searchFriends = (req, res) => {
    let name = req.params.name;
    let sql = 'SELECT * FROM friends WHERE name LIKE "%' + name + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const user = result.filter((e) => e.name.toUpperCase() !== -1);
            if (user.length === 0) {
                res.json({ massage: "no user name", status: 202 });
            } else {
                res.json({ status: 200, result: user });
            }
        }

    });
};
module.exports = {
    getAllFriends,
    CreateFriends,
    searchFriends
}