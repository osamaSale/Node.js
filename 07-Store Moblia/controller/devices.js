const connection = require("../connection/mysql");
const cloudinary = require("../connection/cloudinary");



//    ====================  Error =================================== //

const error422 = (massage) => {
    let data = {
        status: 422,
        massage: massage,
    };
    return data;
};

// ==================== List All Devices ==================================== //
const getDevicesList = (req, res) => {
    let sql = `select * from devices`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                res.json({ status: 202, massage: "No devices Found" });
            } else {
                res.json({
                    status: 200,
                    massage: "Devices Successfully",
                    result: result,
                });
            }
        } else {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
    });
}
// ============================== Create  =================================== //

const createDevices = async (req, res) => {
    let name = req.body.name;
    let image = req.file;
    let cloudinary_id = null;
    if (name === "") {
        res.json(error422("Enter your name"));
    } else if (!image) {
        res.json(error422("Enter your Image"));
    } else {
        if (image) {
            let img = await cloudinary.uploader.upload(req.file.path, { folder: "store_mobile/devices" });
            cloudinary_id = img?.public_id;
            image = img?.secure_url;
            let sql = `INSERT INTO devices (name, image , cloudinary_id) 
            VALUES('${name}', '${image}' ,'${cloudinary_id}')`;
            connection.query(sql, async (err, result) => {
                let data = {
                    name: name,
                    image: image,
                    cloudinary_id: cloudinary_id,
                };
                if (result) {
                    res.json({
                        massage: "Successfully Create devices",
                        status: 200,
                        result: data,
                    });
                }
                if (err) {
                    let imageUrl;
                    let public_id = data.cloudinary_id.replace('store_mobile/devices/g', '')
                    await cloudinary.uploader.destroy(public_id).then((res) => {
                        imageUrl = res
                    });
                    res.json({
                        status: 201,
                        massage: `You have entered invalid `,
                        imageUrl: imageUrl,
                    });
                }
            })
        }
    }
}

// ================================= Single ======================================= //

const singleDevices = (req, res) => {
    let id = req.params.id;
    let sql = `select * from devices where id = ${id}`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No device Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "Devices Successfully",
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

const editDevices = async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let image = req.file;
    let cloudinary_id = null;
    let sql = `select * from devices where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (result) {
            const categorie = result.find((e) => e.id);
            if (categorie === undefined) {
                res.json({ massage: "no devices id", status: 202 });
            } else {
                if (image) {
                    let imageUrl;
                    let public_id = categorie.cloudinary_id.replace('store_mobile/devices/g', '')
                    await cloudinary.uploader.destroy(public_id).then((res) => {
                        imageUrl = res
                    });
                    image = await cloudinary.uploader.upload(req.file.path, { folder: "store_mobile/devices" });
                    cloudinary_id = image?.public_id;
                    image = image?.secure_url;
                } else {
                    image = categorie.image;
                    cloudinary_id = categorie.cloudinary_id;
                }
                let sql = `update devices set  
                name = '${name}',
                image = '${image}',
                cloudinary_id = '${cloudinary_id}'
                where id = '${id}'`
                connection.query(sql, async (err, result) => {
                    let data = {
                        id: id,
                        name: name,
                        image: image,
                        cloudinary_id: cloudinary_id,
                    };
                    if (result) {
                        res.json({
                            massage: "Successfully Edit",
                            status: 200,
                            result: data,
                        });
                    }

                    if (err) {
                        let imageUrl;
                        let public_id = data.cloudinary_id.replace('store_mobile/devices/g', '')
                        await cloudinary.uploader.destroy(public_id).then((res) => {
                            imageUrl = res
                        });
                        res.json({
                            Massage: " You have entered invalid",
                            status: 201,
                            imageUrl: imageUrl
                        });
                    }
                })
            }
        }
    })
}

// ============================================== Delete ===================================== //

const deleteDevices = (req, res) => {
    let id = req.params.id;
    let sql = `select * from devices where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
        if (result) {
            const device = result.find((e) => e.id);
            if (device === undefined) {
                res.json({ massage: "no device id", status: 202 });
            } else {
                let imageUrl;
                let public_id = device.cloudinary_id.replace('store_mobile/devices/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => {
                    imageUrl = res
                });
                let sql = `delete from devices where id='${id}'`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        res.json(err);
                    }
                    if (result) {
                        res.json({
                            id: device.id,
                            imageUrl: imageUrl,
                            massage: "Successfully Delete",
                            status: 200,
                        });
                    }
                })
            }
        }
    })
}

// ==============================   Search  ========================================= //


const searchDevices = (req, res) => {
    let name = req.params.name;
    let sql = 'SELECT * FROM devices WHERE name LIKE "%' + name + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const device = result.filter((e) => e.name.toUpperCase() !== -1);
            if (device.length === 0) {
                res.json({ massage: "no devices name", status: 202 });
            } else {
                res.json({ status: 200, result: device });
            }
        }
    });
};
module.exports = {
    getDevicesList,
    singleDevices,
    createDevices,
    editDevices,
    deleteDevices,
    searchDevices
}