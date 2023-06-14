const UserModel = require("../models/UserModel")

module.exports.getUser = async(req, res) => {
  const user = await UserModel.find(
    res.send(user)
  )
}

module.exports.saveUser = (req, res) => {
  const { user } = req.body;

  UserModel.create({ user })
    .then((data) => {
      console.log("Successfully...");
      res.status(201).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "Something went wrong!" });
    });
};