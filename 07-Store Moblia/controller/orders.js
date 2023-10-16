const connection = require("../connection/mysql");


// ============================  Error  =================================== //

const error422 = (massage) => {
    let data = {
        status: 422,
        massage: massage,
    };
    return data;
};


// =============================== List All Orders ================================ //

const getListOrders = (req, res) => {
    let data = []
    let sql = `select * from orders`;
    connection.query(sql, (err, result) => {
        let sql = `select * from listOrderProduct`;
        data = { result: result }
        connection.query(sql, (err, result) => {
            data.result?.forEach((order) => {
                order.products = result ? result.filter((u) => u.orderid === parseInt(order.orderid)) : []
            })
            res.json({ result: data.result })
        })
    });
};

// =============================== Find Order User Products ================================ //
const findOrderUserProducts = async (req, res) => {
    const orderid = req.params.orderid;
    const userId = req.params.userId;
    let data = []
    let sql = `select * from orders where userId = ${userId}`;
    connection.query(sql, (err, result) => {
        let sql = `select * from listOrderProduct`;
        data = { result: result }
        connection.query(sql, (err, result) => {
            data.result?.forEach((order) => {
                order.products = result ? result.filter((u) => u.orderid === parseInt(order.orderid)) : []
            })
            res.json({ result: data.result })
        })
    });
}


// =============================== Create Orders ================================ //


const createOrder = async (req, res) => {
    let userId = req.body.userId;
    let checkout = req.body.checkout;
    let total = req.body.total;
    let date = req.body.date;
    if (userId === "") {
        res.json(error422("Enter your userId"));
    } else

        if (checkout === "") {
            res.json(error422("Enter your checkout"));
        }

        else if (total === "") {
            res.json(error422("Enter your total"));
        }
        else {
            let sql = `INSERT INTO orders (userId ,checkout , date , total) 
                      VALUES('${userId}' , '${checkout}' , '${date}' , '${total}')`;
            connection.query(sql, async (err, result) => {

                if (result) {
                    let sql = `INSERT INTO listOrderProduct 
                    (userId , productid, editPrice , device , color , name , image , quantity , orderid)
                    SELECT 
                    carts.userId, 
                    carts.productid, 
                    carts.editPrice,
                    carts.device,
                    carts.color, 
                    carts.name, 
                    carts.image,
                    carts.quantity,
                    orders.orderid
                    FROM carts
                    JOIN orders
                    ON carts.userId = orders.userId
                     where  carts.userId = ${userId} and orders.orderid = ${result.insertId};`
                    connection.query(sql, async (err, result) => {

                        let sql = `DELETE FROM carts WHERE userId=${userId};`
                        connection.query(sql, async (err, result) => {
                            let data = {
                                userId: userId,
                                checkout: checkout,
                                total: total,
                                date: date
                            };
                            res.json({
                                massage: "successfully Create orders",
                                status: 200,
                                result: data,
                            });
                        })

                    })
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


const deleteOrder = (req, res) => {
    const orderid = req.params.orderid;
    let sql = `delete from orders where orderid='${orderid}'`;
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 202, massage: "Internal Server Error" });
        }
        let sql = `delete from listOrderProduct where orderid='${orderid}'`;
        connection.query(sql, (err, result) => {
            if (err) {
                res.json({ err: err, status: 202, massage: "Internal Server Error" });
            }
            res.json({ massage: "successfully Delete", status: 200 });
        })

    })


};




// ================================ Edit =============================================== //



const editOrder = (req, res) => {
    let orderid = req.body.orderid;
    let userId = req.body.userId;
    let checkout = req.body.checkout;
    let total = req.body.total;
    let date = req.body.date;
    let sql = `select * from orders where orderid='${orderid}'`;
    connection.query(sql, async (err, result) => {
        if (result) {
            const user = result.find((e) => e.orderid);
            if (user === undefined) {
                res.json({ massage: "no orders id", status: 202 });
            } else {
                let sql = `update orders set 
                userId = '${userId}',
                checkout = '${checkout}',
                date = '${date}',
                total = '${total}'
                where orderid = '${orderid}'`;
                connection.query(sql, (err, result) => {
                    if (err) {
                     
                        res.json({
                            Massage: "You have entered invalid ",
                            status: 200,
                        });
                    } else {
                        let data = {
                            userId: userId,
                            checkout: checkout,
                            date: date,
                            total: total,
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
// ==============================   Search  ========================================= //



const searchOrder = (req, res) => {
    let userId = req.params.userId;
    let sql = 'SELECT * FROM orders WHERE userId LIKE "%' + userId + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const user = result.filter((e) => e.userId);
            if (user.length === 0) {
                res.json({ massage: "no user user", status: 202 });
            } else {
                res.json({ status: 200, result: user });
            }
        } else {
            console.log(err)
        }

    });
};









module.exports = {
    getListOrders,
    findOrderUserProducts,
    editOrder,
    createOrder,
    deleteOrder,
    searchOrder,
}