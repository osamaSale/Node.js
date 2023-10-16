const connection = require("../connection/mysql");


// ==================== List All cart ==================================== //

const getListCart = (req, res) => {
    let sql = `select * from carts`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No cart" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "carts List  Successfully",
                    result: result,
                };
                res.json(data);
            }
        } else {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
    });
};

// =============================== create Cart ================================== //

const createCart = async (req, res) => {
    let userId = req.body.userId
    let productid = req.body.productid
    let price = req.body.price
    let editPrice = req.body.editPrice
    let device = req.body.device;
    let color = req.body.color;
    let name = req.body.name;
    let image = req.body.image;
    let quantity = req.body.quantity;

    if (userId === "") {
        res.json(error422("Enter your userId"));
    }
    else {
        let sql = `INSERT INTO carts (userId , productid , price , editPrice , device , color ,name , image , quantity ) 
        VALUES('${userId}' ,'${productid}' , '${price}' ,'${editPrice}' , '${device}' , '${color}' , '${name}' , '${image}' , '${quantity}')`;
        connection.query(sql, async (err, result) => {
            let data = {
                userId: userId,
                productid: productid,
                quantity: quantity,
                price: price,
                editPrice: editPrice,
                image: image,
                color: color,
                name: name,
                device: device
            };
            if (result) {
                res.json({
                    massage: "successfully Create cart",
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
    }
};


// ================================= Delete ====================================== //


const deleteCart = (req, res) => {
    const id = req.params.id;
    let sql = `select * from carts where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
        if (result) {
            const cart = result.find((e) => e.id);
            if (cart === undefined) {
                res.json({ massage: "no user id", status: 202 });
            } else {
                let sql = `delete from carts where id='${id}'`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        res.json(err);
                    }
                    if (result) {
                        res.json({
                            massage: "successfully Delete",
                            status: 200,
                            id: id
                        });
                    }
                });
            }
        }
    });
};


// ================================ Edit =============================================== //



const editCart = (req, res) => {
    let id = req.body.id
    let userId = req.body.userId
    let productid = req.body.productid
    let price = req.body.price
    let editPrice = req.body.editPrice
    let device = req.body.device;
    let color = req.body.color;
    let name = req.body.name;
    let image = req.body.image;
    let quantity = req.body.quantity;
    let sql = `select * from carts where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (result) {
            const user = result.find((e) => e.id);
            if (user === undefined) {
                res.json({ massage: "no cart id", status: 202 });
            } else {
                let sql = `update carts set 
                userId = '${userId}',
                productid = '${productid}',
                price = '${price}',
                editPrice = '${editPrice}',
                device = '${device}',
                color = '${color}',
                name = '${name}',
                image = '${image}',
                quantity = '${quantity}'
                where id = '${id}'`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.json({
                            Massage: " You have entered invalid ",
                            status: 200,
                        });
                    } else {

                        if (result) {
                            res.json({
                                massage: "successfully Edit",
                                status: 200,
                                result: user,
                            });
                        }
                    }
                });
            }
        }
    });
};


// ================================= Single ======================================= //

const singleCart = (req, res) => {
    let id = req.params.id;
    let sql = `select * from carts where id = ${id}`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No cart Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "cart Fetched successfully",
                    result: result,
                };
                res.json(data);
            }
        } else {
            res.json({ err: err, status: 203, error: "Internal Server Error" });
        }
    });
};
// ================================= Find User Cart ======================================= //

const findCartUser = (req, res) => {
    let userId = req.params.userId;
    let sql = `select * from carts where userId = '${userId}'`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No cart Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "cart Fetched successfully",
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



const searchCart = (req, res) => {
    let userId = req.params.userId;
    let sql = 'SELECT * FROM carts WHERE userId LIKE "%' + userId + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const user = result.filter((e) => e.userId);
            if (user.length === 0) {
                res.json({ massage: "no user name", status: 202 });
            } else {
                res.json({ status: 200, result: user });
            }
        }

    });
};

module.exports = {
    getListCart,
    createCart,
    deleteCart,
    editCart,
    singleCart,
    searchCart,
    findCartUser
}