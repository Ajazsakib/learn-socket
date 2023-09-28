const User = require('../models/userModel');
const Chat = require("../models/chatModel")
const bcrypt = require('bcrypt');

module.exports.registerLoad = function (req, res) {
  try {
    return res.render('register');
  } catch (error) {
    console.log(error);
  }
};

module.exports.register = async function (req, res) {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    console.log(req.body);
    console.log(req.file);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      image: 'images/' + req.file.filename,
      password: passwordHash,
    });

    await user.save();

    return res.render('register', {
      message: 'Registration Successfull',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.loadlogin = function (req, res) {
  try {
    return res.render('login');
  } catch (error) {
    console.log(error);
  }
};

module.exports.login = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        req.session.user = userData;
        return res.redirect('/dashboard');
      } else {
        return res.render('login', {
          message: 'Email or password is incorrect!!',
        });
      }
    } else {
      return res.render('login', {
        message: 'Email or password is incorrect!!',
      });
    }
    console.log('??>>>else');
  } catch (error) {
    console.log(error);
  }
};

module.exports.logout = function (req, res) {
  try {
    req.session.destroy();
    return res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

module.exports.loadDashboard = async function (req, res) {
  try {

    var users = await User.find({ _id: { $nin: [req.session.user._id] } })

    return res.render('dashboard', {
      user: req.session.user,
      users: users,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.saveChat = async function (req, res) {
  try {

    var chat = new Chat({
      sender_id: req.body.sender_id,
      receiver_id: req.body.receiver_id,
      message: req.body.message
    })

    var newChat = await chat.save()

    res.status(200).send({ success: true, msg: "Chat Inserted", data: newChat })

  } catch (error) {
    res.status(400).send({
      success: false,
      msg: error.message
    })
  }
}
