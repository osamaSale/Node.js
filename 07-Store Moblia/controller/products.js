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

// ==================== List All Products ======================================= //


const getProductsList = (req, res) => {
    let sql = `select * from products`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No products Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "products List Fetched Successfully",
                    result: result,
                };
                res.json(data);
            }
        } else {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
    });

}


// ================================= Single ======================================= //


const singleProduct = (req, res) => {
    let id = req.params.id;
    let sql = `select * from products where id = ${id}`;
    connection.query(sql, (err, result) => {
        if (result) {
            if (result.length === 0) {
                let data = { status: 202, massage: "No products Found" };
                res.json(data);
            } else {
                let data = {
                    status: 200,
                    massage: "Products Fetched successfully",
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


const searchProduct = (req, res) => {
    let name = req.params.name;
    let sql = 'SELECT * FROM products WHERE name LIKE "%' + name + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const product = result.filter((e) => e.name.toUpperCase() !== -1);
            if (product.length === 0) {
                res.json({ massage: "no products name", status: 202 });
            } else {
                res.json({ status: 200, result: product });
            }
        }
    });
};



// =============================  Create ================================ //

const createProduct = async (req, res) => {
    let name = req.body.name;
    let image = req.file;
    let brand = req.body.brand;
    let device = req.body.device;
    let color = req.body.color;
    let price = req.body.price;
    let description = req.body.description;
    let stock = req.body.stock;
    let cloudinary_id = null;
    if (name === "") {
        res.json(error422("Enter your name"));
    } else if (!image) {
        res.json(error422("Enter your Image"));
    } else if (device === "") {
        res.json(error422("Enter your device"));
    } else if (price === "") {
        res.json(error422("Enter your price"));
    } else if (brand === "") {
        res.json(error422("Enter your brands"));
    } else if (color === "") {
        res.json(error422("Enter your color"));
    } else if (stock === "") {
        res.json(error422("Enter your stock"));
    } else {
        if (image) {
            let img = await cloudinary.uploader.upload(req.file.path, { folder: "store_mobile/products" });
            cloudinary_id = img?.public_id;
            image = img?.secure_url;
            let sql = `INSERT INTO products ( name, image ,brand , device , color , price ,description , stock , cloudinary_id) 
            VALUES('${name}', '${image}' ,'${brand}' , '${device}' , '${color}' , '${price}' , '${description}' , '${stock}'  ,'${cloudinary_id}')`;
            connection.query(sql, async (err, result) => {
                let data = {
                    name: name,
                    image: image,
                    brand: brand,
                    device: device,
                    color: color,
                    price: price,
                    description: description,
                    stock: stock,
                    cloudinary_id: cloudinary_id,
                };

                if (result) {
                    res.json({
                        massage: "successfully Create products",
                        status: 200,
                        result: data,
                    });
                }
                if (err) {
                    console.log(err)
                    let imageUrl;
                    let public_id = data.cloudinary_id.replace('store_mobile/products/g', '')
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

// =============================== Edit =========================================== //

const editProduct = async (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let image = req.file;
    let brand = req.body.brand;
    let device = req.body.device;
    let color = req.body.color;
    let price = req.body.price;
    let description = req.body.description;
    let stock = req.body.stock;
    let cloudinary_id = null;
    let sql = `select * from products where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (result) {
            const product = result.find((e) => e.id);
            if (product === undefined) {
                res.json({ massage: "no products id", status: 202 });
            } else {
                if (image) {
                    let imageUrl;
                    let public_id = product.cloudinary_id.replace('store_mobile/products/g', '')
                    await cloudinary.uploader.destroy(public_id).then((res) => {
                        imageUrl = res
                    });
                    image = await cloudinary.uploader.upload(req.file.path, { folder: "store_mobile/products" });
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
                description = '${description}',
                stock = '${stock}',
                cloudinary_id = '${cloudinary_id}'
                where id = '${id}'`
                connection.query(sql, async (err, result) => {
                    let data = {
                        id: id,
                        name: name,
                        image: image,
                        brand: brand,
                        device: device,
                        color: color,
                        price: price,
                        description: description,
                        stock: stock,
                        cloudinary_id: cloudinary_id,
                    };
                    if (result) {
                        res.json({
                            massage: "successfully Edit",
                            status: 200,
                            result: data,
                        });
                    }

                    if (err) {
                        let imageUrl;
                        let public_id = data.cloudinary_id.replace('store_mobile/users/g', '')
                        await cloudinary.uploader.destroy(public_id).then((res) => {
                            imageUrl = res
                        });
                        res.json({
                            massage: " You have entered invalid",
                            status: 201,
                            imageUrl: imageUrl
                        });
                    }
                })
            }
        }
    })
}


// =============================== Delete =========================================== //


const deleteProduct = (req, res) => {
    const id = req.params.id;
    let sql = `select * from products where id='${id}'`;
    connection.query(sql, async (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" });
        }
        if (result) {
            const product = result.find((e) => e.id);
            if (product === undefined) {
                res.json({ massage: "no products id", status: 202 });
            } else {
                let imageUrl;
                let public_id = product.cloudinary_id.replace('store_mobile/product/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => {
                    imageUrl = res
                });
                let sql = `delete from products where id='${id}'`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        res.json(err);
                    }
                    if (result) {
                        res.json({
                            id: product.id,
                            imageUrl: imageUrl,
                            massage: "successfully Delete",
                            status: 200,
                        });
                    }
                })
            }
        }
    })
}


// ==============================   Search  ========================================= //


const searchCategoriesProduct = (req, res) => {
    let categories = req.params.categories;
    let sql = 'SELECT * FROM products WHERE categories LIKE "%' + categories + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const product = result.filter((e) => e.name.toUpperCase() !== -1);
            if (product.length === 0) {
                res.json({ massage: "no products name", status: 202 });
            } else {
                res.json({ status: 200, result: product });
            }
        }
    });
};
module.exports = {
    getProductsList,
    createProduct,
    editProduct,
    singleProduct,
    searchProduct,
    deleteProduct,
    searchCategoriesProduct
};