const connection = require("../connection/mysql");


//    ====================  Error =================================== //

const error422 = (massage) => {
    let data = {
        status: 422,
        massage: massage,
    };
    return data;
};

// ==================== List All brands ==================================== //
const getBrands = (req, res) => {
    let sql = `select * from brands`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                res.json({ status: 202, massage: "No brands Found" });
            } else {
                res.json({
                    status: 200,
                    massage: "brands Successfully",
                    result: result,
                });
            }
        } else {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
    });
}

// ============================== Create  =================================== //

const createBrands = async (req, res) => {
    let name = req.body.name;
    if (name === "") {
        res.json(error422("Enter your name"));
    } else {
        let sql = `INSERT INTO brands (name) VALUES('${name}')`;
        connection.query(sql, async (err, result) => {
            let data = { name: name };
            if (result) {
                res.json({
                    massage: "successfully Create Brands",
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

// ================================= Single ======================================= //

const singleBrands = (req, res) => {
    let id = req.params.id;
    let sql = `select * from brands where id = ${id}`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No Brands Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "Brands Fetched successfully",
                    result: result,
                };
                res.json(data);
            }
        } else {
            res.json({ err: err, status: 203, error: "Internal Server Error" });
        }
    });
};
// ======================================= Edit ================================= //

const editBrands = async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let sql = `select * from brands where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (result) {
            const brands = result.find((e) => e.id);
            if (brands === undefined) {
                res.json({ massage: "no electronics id", status: 202 });
            } else {

                let sql = `update brands set  
                name = '${name}'
                where id = '${id}'`
                connection.query(sql, async (err, result) => {
                    let data = { id: id, name: name };
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
                            status: 201
                        });
                    }
                })
            }
        }
    })
}

// ============================================== Delete ===================================== //

const deleteBrands = (req, res) => {
    let id = req.params.id;
    let sql = `select * from brands where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
        if (result) {
            const brands = result.find((e) => e.id);
            if (brands === undefined) {
                res.json({ massage: "no electronic id", status: 202 });
            } else {
                let sql = `delete from brands where id='${id}'`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        res.json(err);
                    }
                    if (result) {
                        res.json({
                            id: brands.id,
                            massage: "successfully Delete",
                            status: 200,
                        });
                    }
                })
            }
        }
    })
}

// ==============================   Search  ========================================= //


const searchBrands = (req, res) => {
    let name = req.params.name;
    let sql = 'SELECT * FROM brands WHERE name LIKE "%' + name + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const brands = result.filter((e) => e.name.toUpperCase() !== -1);
            if (brands.length === 0) {
                res.json({ massage: "no brands name", status: 202 });
            } else {
                res.json({ status: 200, result: brands });
            }
        }
    });
};
module.exports = {
    getBrands,
    createBrands,
    singleBrands,
    editBrands,
    deleteBrands,
    searchBrands
}