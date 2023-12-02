const connection = require("../connection/mysql");
const cloudinary = require("../connection/cloudinary");
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
    let image = req.file;
    let cloudinary_id = null;
    if (name === "") {
        res.json(error("Enter your name"));
    } else if (!image) {
        res.json(error("Enter your Image"));
    } else {
        image = req.file
        if (image = req.file) {
            image = await cloudinary.uploader.upload(req.file.path, { folder: "Store-Mobile/devices" });
            cloudinary_id = image?.public_id;
            image = image?.secure_url;
        } else {
            image = req.body.image
        }
        let sql = `INSERT INTO devices (name, image , cloudinary_id) 
        VALUES('${name}', '${image}' ,'${cloudinary_id}')`;
        connection.query(sql, async (err, result) => {
            let data = { name: name, image: image, cloudinary_id: cloudinary_id };
            if (err) {
                let public_id = data.cloudinary_id === null ? "null" : data.cloudinary_id.replace('Store-Mobile/devices/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => { imageUrl = res });
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
    let image = req.file;
    let cloudinary_id = null;
    let sql = `select * from devices where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const device = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" })
        } else if (device === undefined) {
            res.json({ massage: "no device id", status: 201 });
        } else {
            if (image) {
                let public_id = device.cloudinary_id.replace('Store-Mobile/devices/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => {
                    imageUrl = res
                })
                image = await cloudinary.uploader.upload(req.file.path, { folder: "Store-Mobile/devices" });
                cloudinary_id = image?.public_id;
                image = image?.secure_url;
            } else {
                image = device.image;
                cloudinary_id = device.cloudinary_id;
            }
            let sql = `update devices set name = '${name}', image = '${image}', cloudinary_id = '${cloudinary_id}' where id = '${id}'`
            connection.query(sql, async (err, result) => {
                let data = { id: id, name: name, image: image, cloudinary_id: cloudinary_id };
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
            let public_id = device.cloudinary_id.replace('Store-Mobile/devices/g', '')
            await cloudinary.uploader.destroy(public_id).then((res) => { res })
            let sql = `delete from devices where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" });
                }else{
                    res.json({ id: device.id, massage: "Successfully Delete", status: 200 })
                }
            })
        }
    })
}

module.exports = {getAllDevices , createDevices , editDevices , deleteDevices}