const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// handle errors
const handleErrors = (err) => {
  console.log("message:", err.message, "code: ", err.code);
  let errors = {email: '', password: ''};

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  };

  if (err.code === 11000) {
    errors.email = "email already exist"
  }
  return errors;
}

const createToken = (id) => {
  return jwt.sign({ id }, 'secret4me', {
    expiresIn: 3600
  })
}

module.exports.signupGet = (req, res) => {
  res.render('signup')
};

module.exports.loginGet = (req, res) => {
  res.render('login')
};

module.exports.signupPost = async (req, res) => {
  let { email, password } = req.body;
  const salt = await bcrypt.genSalt()
  const hashedPass = await bcrypt.hash(password, salt)
  try {
    const user = await User.create({ email, password: hashedPass })
    const token = createToken(user._id)
    res.cookie('jwt', token, { 
      httpOnly: true,
      maxAge: 3600 * 1000
    })

    res.status(201).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600 * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logoutGet = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1})
  res.redirect('/')
}
