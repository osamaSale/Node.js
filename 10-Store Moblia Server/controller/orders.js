const connection = require("../connection/mysql");


// ============================ Get All Orders ============================ //

const getAllOrders = (req, res) => {
    let data = [];
    let sql = `select * from orders ORDER BY orderid DESC`;
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No Order Found" });
        } else {
            data = { result: result }
            let sql = `select * from listOrderProduct`;
            connection.query(sql, (err, result) => {
                data.result?.forEach((order) => {
                    order.products = result ? result.filter((u) => u.orderid === parseInt(order.orderid)) : []
                })
                res.json({ status: 200, massage: "Successfully", result: data.result })
            })
        }
    })
}

// ============================ Create Orders ============================ //

const createOrder = async (req, res) => {
    let userId = req.body.userId;
    let checkout = req.body.checkout;
    let total = req.body.total;
    let date = new Date().toISOString()
    let sql = `INSERT INTO orders (userId ,checkout , date , total) 
    VALUES('${userId}' , '${checkout}' , '${date}' , '${total}')`;
    connection.query(sql, async (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else {
            let sql = `INSERT INTO listOrderProduct 
            (userId , productid, name , image , brand , device , color , total , quantity , orderid)
            SELECT 
            carts.userId, 
            carts.productid, 
            carts.name,
            carts.image,
            carts.brand, 
            carts.device, 
            carts.color,
            carts.total,
            carts.quantity,
            orders.orderid
            FROM carts
            JOIN orders
            ON carts.userId = orders.userId
             where  carts.userId = ${userId} and orders.orderid = ${result.insertId};`
            connection.query(sql, async (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, error: "Internal Server Error" });
                } else {
                    let sql = `DELETE FROM carts WHERE userId=${userId};`
                    connection.query(sql, async (err, result) => {
                        if (err) {
                            res.json({ err: err, status: 500, error: "Internal Server Error" });
                        } else {
                            res.json({ status: 200, massage: "Successfully" });
                        }
                    })
                }
            })
        }
    })
}

// ============================ Edit Orders ============================ //

const editOrder = (req, res) => {
    let orderid = req.body.orderid;
    let userId = req.body.userId;
    let checkout = req.body.checkout;
    let total = req.body.total;
    let date = new Date().toISOString()
    let sql = `select * from orders where orderid='${orderid}'`;
    connection.query(sql, async (err, result) => {
        const order = result.find((e) => e.orderid);
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (order === undefined) {
            res.json({ massage: "no Orders id", status: 201 });
        } else {
            let sql = `update orders set 
            userId = '${userId}',
            checkout = '${checkout}',
            date = '${date}',
            total = '${total}'
            where orderid = '${orderid}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, error: "Internal Server Error" });
                } else {
                    res.json({ status: 200, massage: "Successfully", result: order });
                }
            })
        }
    })

}

// ============================ Edit Orders ============================ //

const deleteOrder = (req, res) => {
    const orderid = req.params.orderid;
    let sql = `select * from orders where orderid='${orderid}'`;
    connection.query(sql, (err, result) => {
        const order = result.find((e) => e.orderid);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        } else if (order === undefined) {
            res.json({ massage: "no order id", status: 201 });
        } else {
            let sql = `delete from orders where orderid='${orderid}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" });
                } else {
                    let sql = `delete from listOrderProduct where orderid='${orderid}'`;
                    connection.query(sql, (err, result) => {
                        if (err) {
                            res.json({ err: err, status: 500, massage: "Internal Server Error" });
                        }else{
                            res.json({ massage: "successfully Delete", status: 200 });
                        }
                    })
                }
            })
        }
    })
}
module.exports = { getAllOrders, createOrder, editOrder, deleteOrder }