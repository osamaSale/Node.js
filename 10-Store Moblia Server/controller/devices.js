const connection = require("../connection/mysql");
const { error } = require("./error")

// ==================== Get All Devices ==================================== //
const getAllDevices = (req, res) => {
    let sql = `select * from devices`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                res.json({ status: 201, massage: "No devices Found" });
            } else {
                res.json({ status: 200, massage: "Devices Successfully", result: result });
            }
        } else {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
    });
}

// ============================== Create Devices  =================================== //

const createDevices = async (req, res) => {
    let name = req.body.name;
    if (name === "") {
        res.json(error("Enter your name"));
    } else {

        let sql = `INSERT INTO devices (name) 
        VALUES('${name}')`;
        connection.query(sql, async (err, result) => {
            let data = { name: name };
            if (err) {
                res.json({ err: err, status: 500, error: "Internal Server Error" });
            } else {
                res.json({ massage: "Successfully Create Devices", status: 200, result: data })
            }
        })
    }
}

// ============================== Edit Devices  =================================== //

const editDevices = async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let sql = `select * from devices where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const device = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" })
        } else if (device === undefined) {
            res.json({ massage: "no device id", status: 201 });
        } else {

            let sql = `update devices set name = '${name}' where id = '${id}'`
            connection.query(sql, async (err, result) => {
                let data = { id: id, name: name};
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ massage: "successfully Edit", status: 200, result: data });
                }
            })
        }
    })
}

// ============================== Delete Devices  =================================== //

const deleteDevices = (req, res) => {
    let id = req.params.id;
    let sql = `select * from devices where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const device = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        } else if (device === undefined) {
            res.json({ massage: "no device id", status: 201 });
        } else {
            let sql = `delete from devices where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" });
                } else {
                    res.json({ id: device.id, massage: "Successfully Delete", status: 200 })
                }
            })
        }
    })
}
// =========================  Search Devices =================================== //

const searchDevices = (req, res) => {
    let name = req.params.name;
    let sql = 'SELECT * FROM devices WHERE name LIKE "%' + name + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const user = result.filter((e) => e.name.toUpperCase() !== -1);
            if (user.length === 0) {
                res.json({ massage: "no devicess name", status: 202 });
            } else {
                res.json({ status: 200, result: user });
            }
        }

    });
};
module.exports = { getAllDevices, createDevices, editDevices, deleteDevices, searchDevices }