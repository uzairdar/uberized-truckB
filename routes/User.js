const router = require("express").Router();
let User = require("../models/User.model");
var nodemailer = require("nodemailer");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => {
      return res.json({ users });
    })
    .catch((error) => {
      return res.json({ error });
    });
});
router.route("/check-email/:email").post((req, res) => {
  const { email } = req.params;
  User.findOne({ email })
    .then((users) => {
      if (users) {
        return res.json({ message: "User exists", users, found: true });
      } else {
        return res.json({ message: "User doesnot exist", found: false });
      }
    })
    .catch((error) => {
      return res.json({ message: "User doesnot exist", error, found: false });
    });
});
router.route("/remove/:uid").delete((req, res) => {
  const { uid } = req.params;
  User.findByIdAndDelete(uid)
    .then((user) => {
      if (user) return res.json({ user, message: "User deleted successfully" });
      else return res.json({ message: "User not found by this id" });
    })
    .catch((error) => {
      return res.json({ error });
    });
});

router.route("/createaccount").post((req, res) => {
  console.log("data", req.body);
  const { email, firstname, lastname, address, mobile, position } = req.body;
  const isVerified = false;
  var random = Math.floor(Math.random() * (9999 - 1000) + 1000);

  const newUser = new User({
    firstname,
    lastname,
    email,
    isVerified,
    address,
    mobile,
    position,
  });
  newUser
    .save()
    .then((user) => {
      if (user) {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "uzairdar01@gmail.com",
            pass: "D@r12345",
          },
        });
        var mailOptions = {
          from: "uzairdar01@gmail.com",
          to: email,
          subject: "Uberized Truck pin",
          text: "Pin is: " + random,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        return res.json({
          user,
          message: "User added successfully",
          PinCode: random,
        });
      }
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(409).json({ message: "Email already exists", error: error });
      } else {
        res.status(400).json({ message: "User cannot be added!", error });
      }
    });
});
router.route("/confirmemail/:uid").get((req, res) => {
  const { uid } = req.params;
  const isVerified = true;
  User.findByIdAndUpdate(uid, {
    isVerified,
  })
    .then((user) => {
      return res.json({ user, message: "user is verified", isVerified: true });
    })
    .catch((error) => res.status(400).json({ error }));
});
router.route("/login").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email, password })
    .then((user) => {
      if (user) {
        console.log(user);
        const {
          _id,
          username,
          email,
          image,
          isSeller,
          description,
          isVerified,
          chatId,
        } = user;
        console.log("id", _id);
        const foundUser = {
          _id,
          username,
          email,
          image,
          isSeller,
          description,
          isVerified,
          chatId,
        };

        jwt.sign({ user }, "secretkey", (error, token) => {
          res.json({
            token,
            user: foundUser,
          });
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
});
module.exports = router;
