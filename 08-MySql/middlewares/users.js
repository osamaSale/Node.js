const error422 = (massage) => {
  let data = {
    status: 422,
    massage: massage,
  };
  return data;
};

const Validating = (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let phone = req.body.phone;
  let authorization = req.body.authorization;
  let image = req.body.image || req.file;
  let cloudinary_id = null;
 
  if (name === "") {
    res.json(error422("Enter your name"));
  } 

  res.json(error422("eee"));
}

module.exports = { Validating }