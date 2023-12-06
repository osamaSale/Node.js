const connection = require("../connection/mysql");
const { error } = require("./error")
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;



// ==================== Get All news ==================================== //


const getAllNews = (req, res) => {
    let sql = `select * from news`;
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No News Found" });
        } else {
            res.json({ status: 200, massage: "Successfully", result: result });
        }
    });
}




// ============================== Create News  =================================== //

const createNews = async (req, res) => {
    let email = req.body.email;

    if (!emailRegex.test(email)) {
        res.json(error("Enter your Email"));
    } else {
        let sql = `INSERT INTO news (email) VALUES('${email}' )`;
        connection.query(sql, async (err, result) => {
            let data = { email: email };
            if (err) {
                console.log(err)
                res.json({ err: err, status: 500, error: "Internal Server Error" });
            } else {
                res.json({ massage: "successfully Create News", status: 200, result: data });
            }
        })

    }
}

// ============================== Edit News  =================================== //

const editNews = async (req, res) => {
    let id = req.body.id;
    let email = req.body.email;
    let sql = `select * from news where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const news = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (news === undefined) {
            res.json({ massage: "no news id", status: 201 });
        } else {
            let sql = `update news set email = '${email}' where id = '${id}'`
            connection.query(sql, async (err, result) => {
                let data = { id: id, email: email };
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ massage: "successfully Edit", status: 200, result: data });
                }
            })
        }
    })
}
// ============================================== Delete News ===================================== //

const deleteNews = (req, res) => {
    let id = req.params.id;
    let sql = `select * from news where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const news = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        } else if (news === undefined) {
            res.json({ massage: "no news id", status: 201 });
        } else {
            let sql = `delete from news where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ massage: "Successfully Delete", status: 200, id: news.id });
                }
            })
        }
    })
}
// =========================  Search Contact =================================== //

const searchNews = (req, res) => {
    let email = req.params.email;
    let sql = 'SELECT * FROM news WHERE email LIKE "%' + email + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const user = result.filter((e) => e.email.toUpperCase() !== -1);
            if (user.length === 0) {
                res.json({ massage: "no news name", status: 202 });
            } else {
                res.json({ status: 200, result: user });
            }
        }

    });
};
module.exports = {
    getAllNews,
    createNews,
    editNews,
    deleteNews,
    searchNews
}