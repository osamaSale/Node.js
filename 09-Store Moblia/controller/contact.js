const connection = require("../connection/mysql");
const { error } = require("./error")
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;


// ==================== Get All contact ==================================== //


const getAllContact = (req, res) => {
    let sql = `select * from contact`;
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No Contact Found" });
        } else {
            res.json({ status: 200, massage: "Successfully", result: result });
        }
    });
}

// ============================== Create Contact =================================== //

const createContact = async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;
    if (name === "") {
        res.json(error("Enter your name"));
    } else if (!emailRegex.test(email)) {
        res.json(error("Enter your Email"));
    } else if (message === "") {
        res.json(error("Enter your Message"));
    } else {
        let sql = `INSERT INTO contact (name, email , message) 
        VALUES('${name}', '${email}' ,'${message}')`;
        connection.query(sql, async (err, result) => {
            let data = { name: name, email: email, message: message };
            if (err) {
                console.log(err)
                res.json({ err: err, status: 500, error: "Internal Server Error" });
            } else {
                res.json({ massage: "successfully Create Contact", status: 200, result: data });
            }
        })
    }
}

// ============================== Edit Contact =================================== //

const editContact = async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;
    let sql = `select * from contact where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const contact = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (contact === undefined) {
            res.json({ massage: "no contact id", status: 201 });
        } else {
            let sql = `update contact set  
            name = '${name}',
            email = '${email}',
            message = '${message}'
            where id = '${id}'`
            connection.query(sql, async (err, result) => {
                let data = { id: id, name: name, email: email, message: message };
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ massage: "successfully Edit", status: 200, result: data });
                }
            })
        }
    })
}

// ============================== Delete Contact =================================== //

const deleteContact = (req, res) => {
    let id = req.params.id;
    let sql = `select * from contact where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const contact = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        } else if (contact === undefined) {
            res.json({ massage: "no contact id", status: 201 });
        } else {
            let sql = `delete from contact where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ massage: "successfully Delete", status: 200  , id: contact.id});
                }
            })
        }
    })
}
module.exports = {
    getAllContact,
    createContact,
    editContact,
    deleteContact
}
