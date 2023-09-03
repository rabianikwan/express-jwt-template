const mongoose = require('mongoose')
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
      require: [true, 'Please enter an email'],
      unique: [true],
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    require: [true, 'Please enter a password'],
		minLength: [6, "minimum password length is 6 characters"]
  }
});

// fire function after data saved to db(mongoose hook)
userSchema.post("save", (doc, next) => {
  console.log("new user was created & saved", doc);
  next();
})

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};


const User = mongoose.model('user', userSchema);

module.exports = User;