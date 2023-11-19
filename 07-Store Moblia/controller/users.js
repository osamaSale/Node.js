const connection = require("../../07-Store Moblia/connection/mysql");
const cloudinary = require("../../07-Store Moblia/connection/cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ============================  Error  =================================== //

const error422 = (massage) => {
  let data = {
    status: 422,
    massage: massage,
  };
  return data;
};


// =========================  Get All Users =================================== //


const getUserList = (req, res) => {
  let sql = `select * from users`;
  connection.query(sql, (err, result) => {
    if (result) {
      if (result.length === 0) {
        let data = { status: 202, massage: "No Users Found" };
        res.json(data);
      } else {
        let data = {
          status: 200,
          massage: "Users List Fetched Successfully",
          result: result,
        };
        res.json(data);
      }
    } else {
      res.json({ err: err, status: 500, massage: "Internal Server Error" });
    }
  });
};

// =========================  Single Users =================================== //


const singleUser = (req, res) => {
  let id = req.params.id;
  let sql = `select * from users where id = ${id}`;
  connection.query(sql, (err, result) => {
    if (result) {
      if (result.length === 0) {
        res.json({ status: 202, massage: "No Users Found" });
      } else {
        res.json({
          status: 200,
          massage: "User Fetched successfully",
          result: result[0],
        });
      }
    } else {
      res.json({ err: err, status: 203, error: "Internal Server Error" });
    }
  });
};

// =========================  Register =================================== //


const register = async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let phone = req.body.phone;
  let authorization = req.body.authorization;
  let image = req.body.image || req.file;
  let cloudinary_id = null;
  if (name === "") {
    res.json(error422("Enter your name"));
  } else if (email === "") {
    res.json(error422("Enter your Email"));
  } else if (password === "") {
    res.json(error422("Enter your Password"));
  } else if (phone === "") {
    res.json(error422("Enter your Phone"));
  } else if (authorization === "") {
    res.json(error422("Enter your Authorization"));
  } else if (!image) {
    res.json(error422("Enter your Image"));
  } else {
    image = req.file
    if (image = req.file) {
      image = await cloudinary.uploader.upload(req.file.path, { folder: "store_mobile/users" });
      cloudinary_id = image?.public_id;
      image = image?.secure_url;
    } else {
      image = req.body.image
    }
    password = bcrypt.hashSync(password, Number("salt"));
    let sql = `INSERT INTO users (name, email ,password, image  ,phone ,authorization ,cloudinary_id) 
        VALUES('${name}', '${email}' ,'${password}','${image}' ,'${phone}' , '${authorization}' , '${cloudinary_id}')`;
    connection.query(sql, async (err, result) => {
      let data = {
        name: name,
        email: email,
        password: password,
        image: image,
        phone: phone,
        authorization: authorization,
        cloudinary_id: cloudinary_id
      };
      if (result) {
        res.json({
          massage: "successfully Create user",
          status: 200,
          result: data,
        });
      }
      if (err) {
        let imageUrl;
        let public_id = data.cloudinary_id === null ? "null" : data.cloudinary_id.replace('store_mobile/users/g', '')
        await cloudinary.uploader.destroy(public_id).then((res) => {
          imageUrl = res
        });
        res.json({
          status: 201,
          massage: `You have entered invalid email ${data.email}`,
          imageUrl: imageUrl
        });
      }
    });
  }
};

// =========================  Edit User =================================== //

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
    if (result) {
      const user = result.find((e) => e.id);
      if (user === undefined) {
        res.json({ massage: "no user id", status: 202 });
      } else {
        if (image) {
          let public_id = user.cloudinary_id.replace('store_mobile/users/g', '')
          await cloudinary.uploader.destroy(public_id).then((res) => {
            imageUrl = res
          })
          image = await cloudinary.uploader.upload(req.file.path, { folder: "store_mobile/users" });
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
          if (err) {
            res.json({
              massage: " You have entered invalid  Email",
              status: 200,
            });
          } else {
        
            if (result) {
              res.json({
                massage: "successfully Edit",
                status: 200,
                result: user,
              });
            }
          }
        });
      }
    } else {

      let imageUrl;
      let public_id = data.cloudinary_id.replace('store_mobile/users/g', '')
      await cloudinary.uploader.destroy(public_id).then((res) => {
        imageUrl = res
      });
      res.json({
        status: 201,
        massage: `You have entered invalid email ${data.email}`,
        imageUrl: imageUrl,
      });
    }
  });
};

// =========================  Delete User =================================== //
const deleteUser = (req, res) => {
  const id = req.params.id;
  let sql = `select * from users where id='${id}'`;
  connection.query(sql, async (err, result) => {
    if (err) {
      res.json({ err: err, status: 500, massage: "Internal Server Error" });
    }
    if (result) {
      const user = result.find((e) => e.id);
      if (user === undefined) {
        res.json({ massage: "no user id", status: 202 });
      } else {
        let imageUrl;
        let public_id = user.cloudinary_id.replace('store_mobile/users/g', '')
        await cloudinary.uploader.destroy(public_id).then((res) => {
          imageUrl = res
        });
        let sql = `delete from users where id='${id}'`;
        connection.query(sql, (err, result) => {
          if (err) {
            res.json(err);
          }

          if (result) {
            let sql = `delete from orders where userId='${id}'`;
            connection.query(sql, async (err, result) => {
              res.json({
                id: user.id,
                imageUrl: imageUrl,
                massage: "successfully Delete",
                status: 200,
              });
            })
          }
        });
      }
    }
  });
};

// =========================  Search Users =================================== //

const search = (req, res) => {
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

// =========================  Login =================================== //

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

      if (err) {
        res.json({ err: err });
      }
    });
  }
};

module.exports = {
  getUserList,
  singleUser,
  register,
  deleteUser,
  editUser,
  login,
  search,
};
