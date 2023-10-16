const connection = require("../connection/mysql");

// ==================== List All Save ==================================== //

const getListSave = (req, res) => {
    let sql = `select * from save`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No save Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "Save Successfully",
                    result: result,
                };
                res.json(data);
            }
        } else {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
    });
};
// =============================== create Save ================================== //

const createSave = async (req, res) => {

    let userId = req.body.userId;
    let productid = req.body.productid;
    let price = req.body.price;
    let device = req.body.device;
    let name = req.body.name;
    let image = req.body.image;

    let sql = `INSERT INTO save (userId , productid , price  ,device ,name , image  ) 
                      VALUES('${userId}' ,'${productid}' , '${price}' ,  '${device}' , '${name}' , '${image}')`;
    connection.query(sql, async (err, result) => {
        let data = {
            userId: userId,
            productid: productid,
            price: price,
            image: image,
            name: name,
            device: device
        };
        if (result) {
            res.json({
                massage: "successfully Save",
                status: 200,
                result: data,
            });
        }
        if (err) {

            res.json({
                status: 201,
                massage: `You have entered invalid`,
            });
        }
    });
};


// ================================ Edit Save =============================================== //

const editSave = (req, res) => {
    let id = req.body.id
    let userId = req.body.userId;
    let productid = req.body.productid;
    let price = req.body.price;
    let device = req.body.device;
    let name = req.body.name;
    let image = req.body.image;
    let sql = `select * from save where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (result) {
            const user = result.find((e) => e.id);
            if (user === undefined) {
                res.json({ massage: "no Save id", status: 202 });
            } else {
                let sql = `update save set 
                userId = '${userId}',
                productid = '${productid}',
                price = '${price}',
                device = '${device}',
                name = '${name}',
                image = '${image}'
                where id = '${id}'`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.json({
                            Massage: " You have entered invalid",
                            status: 200,
                        });
                    } else {
                        let data = {
                            userId: userId,
                            productid: productid,
                            price: price,
                            image: image,
                            name: name,
                            device: device
                        };
                        if (result) {
                            res.json({
                                massage: "successfully Edit",
                                status: 200,
                                result: data,
                            });
                        }
                    }
                });
            }
        }
    });
};

// ================================= Delete Save ====================================== //


const deleteSave = (req, res) => {
    const id = req.params.id;
    let sql = `select * from save where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
        if (result) {
            const save = result.find((e) => e.id);
            if (save === undefined) {
                res.json({ massage: "no user id", status: 202 });
            } else {
                let sql = `delete from save where id='${id}'`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        res.json(err);
                    }
                    if (result) {
                        res.json({
                            massage: "Successfully Delete",
                            status: 200,
                            id: id
                        });
                    }
                });
            }
        }
    });
};

// ================================= Find User Save ======================================= //

const findSaveUser = (req, res) => {
    let userId = req.params.userId;
    let sql = `select * from save where userId = '${userId}'`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No save Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "Save Fetched successfully",
                    result: result,
                };
                res.json(data);
            }
        } else {
            res.json({ err: err, status: 203, error: "Internal Server Error" });
        }
    });
};


module.exports = {
    getListSave,
    createSave,
    deleteSave,
    findSaveUser,
    editSave
}