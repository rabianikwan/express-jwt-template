const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token)

  // check json web token exists & is verified
    if (token) {
      jwt.verify(token, 'secret4me', (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          console.log(decodedToken);
          next();
        }
      });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err)
  }
};

// check user current

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'secret4me', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };

module.exports = { requireAuth, checkUser };