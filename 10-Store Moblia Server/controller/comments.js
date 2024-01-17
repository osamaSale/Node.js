const connection = require("../connection/mysql");
const { error } = require("./error")

// ==================== Get All comments ==================================== //
const getAllComments = (req, res) => {
    let data = [];
    let sql = `select * from comments`;
    connection.query(sql, (err, result) => {
     
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No comments Found" });
        } else {
            data = { result: result }
            let sql = `select * from users `;
            connection.query(sql, (err, result) => {
                data.result?.forEach((comment) => {
                    comment.user = result ? result.find((u) => u.id === parseInt(comment.userId)) : []
                })
                res.json({ status: 200, massage: "Successfully", result: data.result })
            })
        }
        
    });
}

// ============================== Create Comments  =================================== //

const createComments = async (req, res) => {
    let userId = req.body.userId;
    let productid = req.body.productid;
    let comment = req.body.comment;
    let date = new Date().toUTCString().slice(5, 16);
    if (comment === "") {
        res.json(error("Enter your comment"));
    } else {
        let sql = `INSERT INTO comments (userId , productid ,date, comment) VALUES('${userId}' , '${productid}','${date}' ,'${comment}')`;
        connection.query(sql, async (err, result) => {
            let data = { userId: userId, productid: productid, comment: comment };
            if (err) {
                res.json({ err: err, status: 500, error: "Internal Server Error" });
            } else {
                res.json({ massage: "successfully Create comment", status: 200, result: data });
            }
        })
    }
}
// ============================== Edit Comments  =================================== //

const editComment = async (req, res) => {
    let id = req.body.id;
    let userId = req.body.userId;
    let productid = req.body.productid;
    let comment = req.body.comment;
    let date = new Date().toUTCString().slice(5, 16)
    if (comment === "") {
        res.json(error("Enter your comment"));
    } else {
        let sql = `update comments set 
        userId = '${userId}',
        productid = '${productid}',
        date = '${date}',
        comment = '${comment}'
        where id = '${id}'`
        connection.query(sql, async (err, result) => {
            let data = { id: id, userId: userId, productid: productid, comment: comment };
            if (err) {
                res.json({ err: err, status: 500, error: "Internal Server Error" });
            } else {
                res.json({ massage: "Successfully", status: 200, result: data });
            }
        })
    }
}

// ============================== Delete Comments  =================================== //

const deleteComment = (req, res) => {
    let id = req.params.id;
    let sql = `select * from comments where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const comment = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        } else {
            let sql = `delete from comments where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" });
                } else {
                    res.json({ id: comment.id, massage: "successfully Delete", status: 200 })
                }
            })
        }
    })
}

// =========================  Search comments =================================== //

const searchComments = (req, res) => {
    let comment = req.params.comment;
    let sql = 'SELECT * FROM comments WHERE comment LIKE "%' + comment + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const comment = result.filter((e) => e.comment.toUpperCase() !== -1);
            if (comment.length === 0) {
                res.json({ massage: "no brand name", status: 202 });
            } else {
                res.json({ status: 200, result: comment });
            }
        }

    });
};

module.exports = {
    getAllComments,
    createComments,
    editComment,
    deleteComment,
    searchComments
}