const connection = require("../connection/mysql");


// ==================== Get All wishlist ==================================== //


const getAllWishlist = (req, res) => {
    let sql = `select * from wishlist`;
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No wishlist Found" });
        } else {
            res.json({ status: 200, massage: "Successfully", result: result });
        }
    });
}


// ==================== Create wishlist ==================================== //

const createWishlist = (req, res) => {
    let userId = req.body.userId;
    let productid = req.body.productid;
    let sql = `select * from products where id = ${productid} `
    connection.query(sql, (err, result) => {
        const wishlist = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (wishlist === undefined) {
            res.json({ massage: "no wishlist id", status: 201 });
        } else {
            let sql = `INSERT INTO wishlist (userId , productid , name , image , brand , device , color , price , priceDiscount ,description ,stock)
            VALUES ('${userId}' , '${productid}', '${wishlist.name}' , '${wishlist.image}', '${wishlist.brand}' , '${wishlist.device}' , '${wishlist.color}', '${wishlist.price}' , '${wishlist.priceDiscount}', '${wishlist.description}'  , '${wishlist.stock}' )`
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, error: "Internal Server Error" });
                } else {
                    res.json({ status: 200, massage: "Successfully", result: wishlist });
                }
            })
        }
    })
}
// ==================== Edit wishlist ==================================== //

const editWishlist = (req, res) => {
    let id = req.body.id
    let userId = req.body.userId;
    let productid = req.body.productid;
    let sql = `select * from products where id = ${productid} `
    connection.query(sql, (err, result) => {
        const wishlist = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (wishlist === undefined) {
            res.json({ massage: "no wishlist id", status: 201 });
        } else {
            let sql = `update wishlist set  
            userId = '${userId}',
            productid = '${productid}',
            name = '${wishlist.name}',
            image = '${wishlist.image}',
            brand = '${wishlist.brand}',
            device = '${wishlist.device}',
            color = '${wishlist.color}',
            price = '${wishlist.price}',
            priceDiscount = '${wishlist.priceDiscount}',
            description = '${wishlist.description}',
            stock = '${wishlist.stock}'
            where id = '${id}'`

            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, error: "Internal Server Error" });
                } else {
                    res.json({ status: 200, massage: "Successfully", result: wishlist });
                }
            })
        }
    })
}

// ==================== Delete wishlist ==================================== //

const deleteWishlist = (req, res) => {
    const id = req.params.id;
    let sql = `select * from wishlist where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const wishlist = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        } else if (wishlist === undefined) {
            res.json({ massage: "no wishlist id", status: 201 });
        } else {
            let sql = `delete from wishlist where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ id: wishlist.id, massage: "Successfully Delete", status: 200 })
                }
            })
        }
    })
}
// =========================  Search wishlist =================================== //

const searchWishlist = (req, res) => {
    let name = req.params.name;
    let sql = 'SELECT * FROM wishlist WHERE name LIKE "%' + name + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const user = result.filter((e) => e.name.toUpperCase() !== -1);
            if (user.length === 0) {
                res.json({ massage: "no wishlist name", status: 202 });
            } else {
                res.json({ status: 200, result: user });
            }
        }

    });
};
module.exports = { getAllWishlist, createWishlist, editWishlist, deleteWishlist, searchWishlist }
