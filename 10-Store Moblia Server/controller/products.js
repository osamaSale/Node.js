const connection = require("../connection/mysql");
const cloudinary = require("../connection/cloudinary");
const { error } = require("./error")

// ============================  Get All Products  =================================== //

const getAllProducts = (req, res) => {
    let sql = 'select * from products'
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No Products Found" });
        } else {
            res.json({
                status: 200, massage: "Successfully", result: result,
            });
        }

    })
}


// ============================  Get All Products  =================================== //

const singleProduct = (req, res) => {
    let id = req.params.id
    let sql = `select * from products where id = '${id}' `
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No Products Found" });
        } else {
            res.json({
                status: 200, massage: "Successfully", result: result,
            });
        }

    })
}

// =========================  Create Product =================================== //
const createProduct = async (req, res) => {
    let name = req.body.name;
    let image = req.body.image || req.file;
    let brand = req.body.brand;
    let device = req.body.device;
    let color = req.body.color;
    let price = req.body.price;
    let priceDiscount = req.body.priceDiscount;
    let description = req.body.description;
    let stock = req.body.stock;
    let cloudinary_id = null;
    if (name === "") {
        res.json(error("Enter your name"));
    } else if (!image) {
        res.json(error("Enter your Image"));
    } else if (device === "") {
        res.json(error("Enter your device"));
    } else if (price === "") {
        res.json(error("Enter your price"));
    } else if (brand === "") {
        res.json(error("Enter your brands"));
    } else if (color === "") {
        res.json(error("Enter your color"));
    } else if (stock === "") {
        res.json(error("Enter your stock"));
    } else if (description === "") {
        res.json(error("Enter your description"));
    } else {
        image = req.file
        if (image = req.file) {
            image = await cloudinary.uploader.upload(req.file.path, { folder: "Store Mobile Server/products" });
            cloudinary_id = image?.public_id;
            image = image?.secure_url;
        } else {
            image = req.body.image
        }
        let sql = `INSERT INTO products ( name, image ,brand , device , color , price , priceDiscount ,description , stock , cloudinary_id) 
        VALUES('${name}', '${image}' ,'${brand}' , '${device}' , '${color}' , '${price}', '${priceDiscount}' , '${description}' , '${stock}'  ,'${cloudinary_id}')`;

        connection.query(sql, async (err, result) => {
            let data = {
                name: name,
                image: image,
                brand: brand,
                device: device,
                color: color,
                price: price,
                priceDiscount: priceDiscount,
                description: description,
                stock: stock,
                cloudinary_id: cloudinary_id,
            };
            if (err) {
                let public_id = data.cloudinary_id === null ? "null" : data.cloudinary_id.replace('Store Mobile Server/products/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => { imageUrl = res });
                res.json({ err: err, status: 500, error: "Internal Server Error" });
            } else {
                res.json({ massage: "successfully Create Product", status: 200, result: data })
            }
        })
    }
}

// =========================  Edit Product =================================== //
const editProduct = async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let image = req.body.image || req.file;
    let brand = req.body.brand;
    let device = req.body.device;
    let color = req.body.color;
    let price = req.body.price;
    let priceDiscount = req.body.priceDiscount;
    let description = req.body.description;
    let stock = req.body.stock;
    let cloudinary_id = null;
    let sql = `select * from products where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const product = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" })
        } else if (product === undefined) {
            res.json({ massage: "no product id", status: 201 });
        } else {
            if (image) {
                let public_id = product.cloudinary_id.replace('Store Mobile Server/products/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => {
                    imageUrl = res
                })
                image = await cloudinary.uploader.upload(req.file.path, { folder: "Store Mobile Server/products" });
                cloudinary_id = image?.public_id;
                image = image?.secure_url;
            } else {
                image = product.image;
                cloudinary_id = product.cloudinary_id;
            }
            let sql = `update products set  
                name = '${name}',
                image = '${image}',
                brand = '${brand}',
                device = '${device}',
                color = '${color}',
                price = '${price}',
                priceDiscount = '${priceDiscount}',
                description = '${description}',
                stock = '${stock}',
                cloudinary_id = '${cloudinary_id}'
                where id = '${id}'`
            connection.query(sql, async (err, result) => {
                let data = {
                    name: name,
                    image: image,
                    brand: brand,
                    device: device,
                    color: color,
                    price: price,
                    priceDiscount: priceDiscount,
                    description: description,
                    stock: stock,
                    cloudinary_id: cloudinary_id,
                };
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ massage: "successfully Edit", status: 200, result: data });
                }
            })
        }
    })
}

// =========================  Delete Product =================================== //

const deleteProduct = (req, res) => {
    const id = req.params.id;
    let sql = `select * from products where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const product = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        } else if (product === undefined) {
            res.json({ massage: "no product id", status: 201 });
        } else {
            let public_id = product.cloudinary_id.replace('Store Mobile Server/products/g', '')
            await cloudinary.uploader.destroy(public_id).then((res) => { imageUrl = res });
            let sql = `delete from products where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ id: product.id, massage: "successfully Delete", status: 200 })
                }
            })
        }
    })
}


// =========================  Search Products =================================== //

const searchProducts = (req, res) => {
    let search = req.params.search;
    let sql = 'SELECT * FROM products WHERE name LIKE "%' + search + '%" OR brand LIKE "%' + search + '%" OR device LIKE "%' + search + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const user = result.filter((e) => e.name.toUpperCase() !== -1);
            if (user.length === 0) {
                res.json({ massage: "no products name", status: 202 });
            } else {
                res.json({ status: 200, result: user });
            }
        }

    });
};

module.exports = { getAllProducts, createProduct, editProduct, deleteProduct, searchProducts, singleProduct }