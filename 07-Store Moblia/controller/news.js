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

// ==================== List All news ==================================== //


const getNewsList = (req, res) => {
    let sql = `select * from news`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No news Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "news List Fetched Successfully",
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

const singleNews = (req, res) => {
    let id = req.params.id;
    let sql = `select * from news where id = ${id}`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No news Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "news Fetched successfully",
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


const searchNews = (req, res) => {
    let email = req.params.email;
    let sql = 'SELECT * FROM news WHERE email LIKE "%' + email + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const news = result.filter((e) => e.email.toUpperCase() !== -1);
            if (news.length === 0) {
                res.json({ massage: "no news email", status: 202 });
            } else {
                res.json({ status: 200, result: news });
            }
        }
    });
};


// ============================== Create Contact =================================== //

const createNews = async (req, res) => {
    let email = req.body.email;

    if (!emailRegex.test(email)) {
        res.json(error422("Enter your Email"));
    } else {
        let sql = `INSERT INTO news (email) 
            VALUES('${email}' )`;
        connection.query(sql, async (err, result) => {
            let data = {
                email: email,
            };
            if (result) {
                res.json({
                    massage: "successfully Create news",
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

const editNews= async (req, res) => {
    let id = req.body.id;
    let email = req.body.email;
    let sql = `select * from news where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (result) {
            const news = result.find((e) => e.id);
            if (news === undefined) {
                res.json({ massage: "no news id", status: 202 });
            } else {
                let sql = `update news set  
                email = '${email}'
                where id = '${id}'`
                connection.query(sql, async (err, result) => {
                    let data = {
                        id: id,
                        email: email,
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

const deleteNews = (req, res) => {
    let id = req.params.id;
    let sql = `select * from news where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
        if (result) {
            const news = result.find((e) => e.id);
            if (news === undefined) {
                res.json({ massage: "no news id", status: 202 });
            } else {
                let sql = `delete from news where id='${id}'`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        res.json(err);
                    }
                    if (result) {
                        res.json({
                            id: news.id,
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
    getNewsList,
    createNews,
    editNews,
    searchNews,
    deleteNews,
    singleNews
}