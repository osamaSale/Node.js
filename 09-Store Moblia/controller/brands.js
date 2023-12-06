const connection = require("../connection/mysql");
const { error } = require("./error")

// ==================== Get All brands ==================================== //
const getAllBrands = (req, res) => {
    let sql = `select * from brands`;
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No brands Found" });
        } else {
            res.json({ status: 200, massage: "Successfully", result: result });
        }
    });
}



// ============================== Create Brand  =================================== //

const createBrands = async (req, res) => {
    let name = req.body.name;
    if (name === "") {
        res.json(error("Enter your name"));
    } else {
        let sql = `INSERT INTO brands (name) VALUES('${name}')`;
        connection.query(sql, async (err, result) => {
            let data = { name: name };
            if (err) {
                res.json({ err: err, status: 500, error: "Internal Server Error" });
            } else {
                res.json({ massage: "successfully Create Brands", status: 200, result: data });
            }
        })
    }
}

// ============================== Edit Brand  =================================== //

const editBrands = async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let sql = `select * from brands where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const brand = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" })
        } else if (brand === undefined) {
            res.json({ massage: "no brand id", status: 201 });
        } else {
            let sql = `update brands set name = '${name}' where id = '${id}'`
            connection.query(sql, async (err, result) => {
                let data = { id: id, name: name };
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ massage: "successfully Edit", status: 200, result: data });
                }
            })
        }
    })
}

// ============================== Delete Brand  =================================== //

const deleteBrands = (req, res) => {
    let id = req.params.id;
    let sql = `select * from brands where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const brand = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        } else {
            let sql = `delete from brands where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" });
                } else {
                    res.json({ id: brand.id, massage: "successfully Delete", status: 200 })
                }
            })
        }
    })
}

// =========================  Search brands =================================== //

const searchBrands = (req, res) => {
    let name = req.params.name;
    let sql = 'SELECT * FROM brands WHERE name LIKE "%' + name + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const user = result.filter((e) => e.name.toUpperCase() !== -1);
            if (user.length === 0) {
                res.json({ massage: "no brand name", status: 202 });
            } else {
                res.json({ status: 200, result: user });
            }
        }

    });
};
module.exports = {
    getAllBrands,
    createBrands,
    editBrands,
    deleteBrands,
    searchBrands
}