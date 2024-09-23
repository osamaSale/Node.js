const connection = require("../connection/mysql")
const cloudinary = require("../connection/cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { error } = require("./error")

// ============================  Get All Users  =================================== //


const getAllUsers = (req, res) => {
    let sql = 'select * from users ORDER BY name'
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No Users Found" });
        } else {

            res.json({ status: 200, massage: "Successfully", result: result });

        }
    })
}
// =========================  Create User =================================== //

const createUser = async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let image = req.body.image || req.file;
    let cloudinary_id = null;
    if (name === "") {
        res.json(error("Enter your name"));
    } else if (email === "") {
        res.json(error("Enter your Email"));
    } else if (password === "") {
        res.json(error("Enter your Password"));
    } else if (phone === "") {
        res.json(error("Enter your Phone"));
    } else if (!image) {
        res.json(error("Enter your Image"));
    } else {
        image = req.file
        if (image = req.file) {
            image = await cloudinary.uploader.upload(req.file.path, { folder: "Chat Server/users" });
            cloudinary_id = image?.public_id;
            image = image?.secure_url;
        } else {
            image = req.body.image
        }
        password = bcrypt.hashSync(password, Number("salt"));
        let sql = `INSERT INTO users (name, email ,password, image  ,phone  ,cloudinary_id) 
        VALUES('${name}', '${email}' ,'${password}','${image}' ,'${phone}'  , '${cloudinary_id}')`;
        connection.query(sql, async (err, result) => {
            let data = { name: name, email: email, password: password, image: image, phone: phone, cloudinary_id: cloudinary_id };

            if (err) {
                let public_id = data.cloudinary_id === null ? "null" : data.cloudinary_id.replace('Chat Server/users/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => { imageUrl = res });
                res.json({ err: err, status: 500, error: "Internal Server Error", massage: `You have entered invalid email ${data.email}` });
            } else {

                res.json({ massage: "successfully Create user", status: 200, result: data })
            }
        })
    }
}

// =========================  Delete User ========================================= //
const deleteUser = (req, res) => {
    const id = req.params.id;
    let sql = `select * from users where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const user = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" })
        } else if (user === undefined) {
            res.json({ massage: "no user id", status: 201 });
        } else {
            let public_id = user.cloudinary_id.replace('Chat Server/users/g', '')
            await cloudinary.uploader.destroy(public_id).then((res) => { imageUrl = res });
            let sql = `delete from users where id='${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ id: user.id, massage: "successfully Delete", status: 200 })
                }
            })
        }
    })
}


// =========================  Edit User ========================================= //

const editUser = (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let bio = req.body.bio
    let image = req.file;
    let cloudinary_id = null;
    let sql = `select * from users where id='${id}'`;
    connection.query(sql, async (err, result) => {
        const user = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" })
        } else if (user === undefined) {
            res.json({ massage: "no user id", status: 201 });
        } else {
            if (image) {
                let public_id = user.cloudinary_id.replace('Chat Server/users/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => {
                    imageUrl = res
                })
                image = await cloudinary.uploader.upload(req.file.path, { folder: "Chat Server/users" });
                cloudinary_id = image?.public_id;
                image = image?.secure_url;
            } else {
                image = user.image;
                cloudinary_id = user.cloudinary_id;
            }
            let sql = `update users set 
              name = '${name}',
              email = '${email}',
              phone = '${phone}',
              image = '${image}',
              bio = '${bio}',
              cloudinary_id = '${cloudinary_id}'
              where id = '${id}'`;
            connection.query(sql, (err, result) => {
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    let sql = `update friends set 
                    name = '${name}',
                    email = '${email}',
                    image = '${image}',
                    phone = '${phone}',
                    bio = '${bio}'
                    where friendId = '${id}'`
                    connection.query(sql, (err, result) => {
                        if (err) {
                            res.json({ err: err, status: 500, massage: "Internal Server Error" })
                        } else {
                            let sql = `update chat set 
                            receiverName = '${name}',
                            receiverEmail = '${email}',
                            receiverImage = '${image}',
                            receiverPhone = '${phone}',
                            receiverBio = '${bio}'
                            where receiverId = '${id}'`
                            connection.query(sql, (err, result) => {
                                if (err) {
                                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                                } else {
                                    res.json({ massage: "successfully Edit", status: 200 });
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}
// =========================  Find Email ========================================= //

const findUserEmail = (req, res) => {
    const email = req.body.email;
    if (email === "") {
        res.json(error("Enter your Email"));
    } else {
        let sql = `select * from users where email='${email}'`;
        connection.query(sql, async (err, result) => {
            const user = result.find(e => e.email === email)
            if (err) {
                res.json({ err: err, status: 500, massage: "Internal Server Error" })

            } else if (user === undefined) {
                res.json({ massage: "You have entered invalid Password", status: 201 });
            } else {
                res.json({ massage: "Successfully", status: 200, result: user });
            }

        })
    }
}
// =========================  update Password ========================================= //

const updatePassword = (req, res) => {
    let email = req.body.email;
    let password = req.body.password
    let sql = `select * from users where email='${email}'`;
    connection.query(sql, async (err, result) => {
        const user = result.find((e) => e.id);
        if (err) {
            res.json({ err: err, status: 500, massage: "Internal Server Error" })
        } else if (user === undefined) {
            res.json({ massage: "no user email", status: 201 });
        } else {
            password = bcrypt.hashSync(password, Number("salt"));
            let sql = `update users set password = '${password}' where email = '${email}'`;
            connection.query(sql, (err, result) => {


                if (err) {
                    res.json({ err: err, status: 500, massage: "You have entered invalid Password" })
                } else {
                    res.json({ massage: "successfully Edit", status: 200 });
                }
            })

        }
    })
}

// =========================  Login ========================================= //

const login = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // if is empty Email and Password

    if (email === "") {
        res.json(error("Enter your Email"));
    } else if (password === "") {
        res.json(error("Enter your Password"));
    } else {
        const sql = `select * from users where email ='${email}' `;
        connection.query(sql, async (err, result) => {
            if (result.length === 0) {
                res.json({ massage: "You have entered invalid Email", status: 500 });
            } else {
                const findUser = result.find((u) => u.id);
                if (findUser) {
                    const id = findUser.id;
                    if (await bcrypt.compare(req.body.password, findUser.password)) {
                        const token = jwt.sign({ id }, "jwtSecret", { expiresIn: process.env.TOKEN_EXPIRATION });
                        res.json({ status: 200, massage: "Successfully", result: findUser, token: token });
                    } else {
                        res.json({ massage: "You have entered invalid Password", status: 201 });
                    }
                }
            }
        });
    }
};

// =========================  Search Users =================================== //

const searchUser = (req, res) => {
    let name = req.params.name;
    let sql = 'SELECT * FROM users WHERE name LIKE "%' + name + '%" ';
    connection.query(sql, (err, result) => {
        if (result) {
            const user = result.filter((e) => e.name.toUpperCase() !== -1);
            if (user.length === 0) {
                res.json({ massage: "no user name", status: 202 });
            } else {
                res.json({ status: 200, result: user });
            }
        }

    });
};


module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    editUser,
    login,
    findUserEmail,
    searchUser,
    updatePassword
}