const connection = require("../connection/mysql");


// ==================== Get All Carts ==================================== //


const getAllCarts = (req, res) => {
    let sql = `select * from carts`;
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No carts Found" });
        } else {
            res.json({ status: 200, massage: "Successfully", result: result });
        }
    });
}


// ==================== Create Cart ==================================== //

const createCart = (req, res) => {
    let userId = req.body.userId;
    let productid = req.body.productid;
    let quantity = req.body.quantity;
    let sql = `select * from products where id = ${productid} `
    connection.query(sql, (err, result) => {
        const cart = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (cart === undefined) {
            res.json({ massage: "no product id", status: 201 });
        } else {
            let total =  parseFloat(cart.priceDiscount) * quantity
            let sql = `INSERT INTO carts (userId , productid , name , image , brand , device , color , price , priceDiscount ,description ,stock , total , quantity)
            VALUES ('${userId}' , '${productid}', '${cart.name}' , '${cart.image}', '${cart.brand}' , '${cart.device}' , '${cart.color}', '${cart.price}' , '${cart.priceDiscount}', '${cart.description}'  , '${cart.stock}' , '${total}'  ,'${quantity}')`
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, error: "Internal Server Error" });
                } else {
                    res.json({ status: 200, massage: "Successfully", result: cart });
                }
            })
        }
    })
}
// ==================== Edit Cart ==================================== //

const editCart = (req, res) => {
    let id = req.body.id
    let userId = req.body.userId;
    let productid = req.body.productid;
    let quantity = req.body.quantity;
    let sql = `select * from products where id = ${productid} `
    connection.query(sql, (err, result) => {
        const cart = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (cart === undefined) {
            res.json({ massage: "no cart id", status: 201 });
        } else {
            let total =  parseFloat(cart.priceDiscount) * quantity
            let sql = `update carts set  
            userId = '${userId}',
            productid = '${productid}',
            name = '${cart.name}',
            image = '${cart.image}',
            brand = '${cart.brand}',
            device = '${cart.device}',
            color = '${cart.color}',
            price = '${cart.price}',
            priceDiscount = '${cart.priceDiscount}',
            description = '${cart.description}',
            stock = '${cart.stock}',
            total = '${total}',
            quantity = '${quantity}'
            where id = '${id}'`

            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, error: "Internal Server Error" });
                } else {
                    res.json({ status: 200, massage: "Successfully", result: cart });
                }
            })
        }
    })
}

// ==================== Delete Cart ==================================== //

const deleteCart = (req, res) => {
    const id = req.params.id;
    let sql = `select * from carts where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const cart = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        } else if (cart === undefined) {
            res.json({ massage: "no cart id", status: 201 });
        } else {
            let sql = `delete from carts where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ id: cart.id, massage: "Successfully Delete", status: 200 })
                }
            })
        }
    })
}
// =========================  Search Cart =================================== //

const searchCarts = (req, res) => {
    let name = req.params.name;
    let sql = 'SELECT * FROM carts WHERE name LIKE "%' + name + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const user = result.filter((e) => e.name.toUpperCase() !== -1);
            if (user.length === 0) {
                res.json({ massage: "no carts name", status: 202 });
            } else {
                res.json({ status: 200, result: user });
            }
        }

    });
};
module.exports = { getAllCarts, createCart, editCart, deleteCart ,searchCarts}
