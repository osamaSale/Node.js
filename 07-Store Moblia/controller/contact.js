const connection = require("../connection/mysql");

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;


//    ====================  Error =================================== //

const error422 = (massage) => {
    let data = {
        status: 422,
        massage: massage,
    };
    return data;
};

// ==================== List All contact ==================================== //


const getContactList = (req, res) => {
    let sql = `select * from contact`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No contact Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "contact List Fetched Successfully",
                    result: result,
                };
                res.json(data);
            }
        } else {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
    });
}

// ================================= Single ======================================= //

const singleContact = (req, res) => {
    let id = req.params.id;
    let sql = `select * from contact where id = ${id}`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No contact Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "contact Fetched successfully",
                    result: result,
                };
                res.json(data);
            }
        } else {
            res.json({ err: err, status: 203, error: "Internal Server Error" });
        }
    });
};
// ==============================   Search  ========================================= //


const searchContact = (req, res) => {
    let name = req.params.name;
    let sql = 'SELECT * FROM contact WHERE name LIKE "%' + name + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const contact = result.filter((e) => e.name.toUpperCase() !== -1);
            if (contact.length === 0) {
                res.json({ massage: "no contact name", status: 202 });
            } else {
                res.json({ status: 200, result: contact });
            }
        }
    });
};


// ============================== Create Contact =================================== //

const createContact = async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let massage = req.body.massage;
    if (name === "") {
        res.json(error422("Enter your name"));
    } else if (!emailRegex.test(email)) {
        res.json(error422("Enter your Email"));
    } else if (massage === "") {
        res.json(error422("Enter your Massage"));
    } else {
        let sql = `INSERT INTO contact (name, email , massage) 
            VALUES('${name}', '${email}' ,'${massage}')`;
        connection.query(sql, async (err, result) => {
            let data = {
                name: name,
                email: email,
                massage: massage,
            };
            if (result) {
                res.json({
                    massage: "successfully Create contact",
                    status: 200,
                    result: data,
                });
            }
            if (err) {
                res.json({
                    status: 201,
                    massage: `You have entered invalid `
                });
            }
        })

    }
}

// ======================================= Edit ================================= //

const editContact = async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    let massage = req.body.massage;
    let sql = `select * from contact where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (result) {
            const contact = result.find((e) => e.id);
            if (contact === undefined) {
                res.json({ massage: "no contact id", status: 202 });
            } else {
                let sql = `update contact set  
                name = '${name}',
                email = '${email}',
                massage = '${massage}'
                where id = '${id}'`
                connection.query(sql, async (err, result) => {
                    let data = {
                        id: id,
                        name: name,
                        email: email,
                        massage: massage,
                    };
                    if (result) {
                        res.json({
                            massage: "successfully Edit",
                            status: 200,
                            result: data,
                        });
                    }

                    if (err) {
                        res.json({
                            Massage: " You have entered invalid",
                            status: 201,
                        });
                    }
                })
            }
        }
    })
}
// ============================================== Delete ===================================== //

const deleteContact = (req, res) => {
    let id = req.params.id;
    let sql = `select * from contact where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
        if (result) {
            const contact = result.find((e) => e.id);
            if (contact === undefined) {
                res.json({ massage: "no contact id", status: 202 });
            } else {
                let sql = `delete from contact where id='${id}'`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        res.json(err);
                    }
                    if (result) {
                        res.json({
                            id: contact.id,
                            massage: "successfully Delete",
                            status: 200,
                        });
                    }
                })
            }
        }
    })
}

module.exports = {
    getContactList,
    createContact,
    editContact,
    searchContact,
    deleteContact,
    singleContact
}