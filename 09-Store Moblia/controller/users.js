const connection = require("../connection/mysql")
const cloudinary = require("../connection/cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { error } = require("./error")


// ============================  Get All Users  =================================== //

const getAllUsers = (req, res) => {
    let sql = 'select * from users'
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 201, massage: "No Users Found" });
        } else {
            res.json({
                status: 200, massage: "Successfully", result: result,
            });
        }

    })
}
// =========================  Single User =================================== //

const singleUser = (req, res) => {
    let id = req.params.id;
    let sql = `select * from users where id = ${id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            res.json({ err: err, status: 500, error: "Internal Server Error" });
        } else if (result.length === 0) {
            res.json({ status: 202, massage: "No Users Found" });
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
    let authorization = req.body.authorization;
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
    } else if (authorization === "") {
        res.json(error("Enter your Authorization"));
    } else if (!image) {
        res.json(error("Enter your Image"));
    } else {
        image = req.file
        if (image = req.file) {
            image = await cloudinary.uploader.upload(req.file.path, { folder: "Store-Mobile/users" });
            cloudinary_id = image?.public_id;
            image = image?.secure_url;
        } else {
            image = req.body.image
        }
        password = bcrypt.hashSync(password, Number("salt"));
        let sql = `INSERT INTO users (name, email ,password, image  ,phone ,authorization ,cloudinary_id) 
        VALUES('${name}', '${email}' ,'${password}','${image}' ,'${phone}' , '${authorization}' , '${cloudinary_id}')`;
        connection.query(sql, async (err, result) => {
            let data = { name: name, email: email, password: password, image: image, phone: phone, authorization: authorization, cloudinary_id: cloudinary_id };

            if (err) {
                let public_id = data.cloudinary_id === null ? "null" : data.cloudinary_id.replace('Store-Mobile/users/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => { imageUrl = res });
                res.json({ err: err, status: 500, error: "Internal Server Error" });
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
            let public_id = user.cloudinary_id.replace('Store-Mobile/users/g', '')
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
    let authorization = req.body.authorization;
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
                let public_id = user.cloudinary_id.replace('Store-Mobile/users/g', '')
                await cloudinary.uploader.destroy(public_id).then((res) => {
                    imageUrl = res
                })
                image = await cloudinary.uploader.upload(req.file.path, { folder: "Store-Mobile/users" });
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
              authorization = '${authorization}',
              cloudinary_id = '${cloudinary_id}'
              where id = '${id}'`;
            connection.query(sql, (err, result) => {
                let data = { name: name, email: email, image: image, phone: phone, authorization: authorization, cloudinary_id: cloudinary_id };
                if (err) {
                    res.json({ err: err, status: 500, massage: "Internal Server Error" })
                } else {
                    res.json({ massage: "successfully Edit", status: 200, result: data });
                }
            })
        }
    })
}

const login = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
  
    // if is empty Email and Password
  
    if (email === "") {
      res.json(error422("Enter your Email"));
    } else if (password === "") {
      res.json(error422("Enter your Password"));
    } else {
  
  
      const sql = `select * from users where email ='${email}' `;
      connection.query(sql, async (err, result) => {
        if (result.length === 0) {
          res.json({ massage: "You have entered invalid Email", status: 203 });
        } else {
          const findUser = result.find((u) => u.id);
          if (findUser) {
            const id = findUser.id;
            if (await bcrypt.compare(req.body.password, findUser.password)) {
              const token = jwt.sign({ id }, "jwtSecret", {
                expiresIn: process.env.TOKEN_EXPIRATION,
              });
              res.json({
                status: 200,
                massage: "successfully Login",
                result: findUser,
                token: token,
              });
            } else {
              res.json({
                massage: "You have entered invalid Password",
                status: 201,
              });
            }
          }
        }
      });
    }
  };
module.exports = {
    getAllUsers,
    singleUser,
    createUser,
    deleteUser,
    editUser,
    login
}