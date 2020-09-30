const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'Email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'Password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'Email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
// const maxAge = 3 * 24 * 60 * 60;
const maxAge =  60 * 60;
// the 'secret' must be private token / long
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const user = await User.create({ email, password, firstName, lastName });
    const token = createToken(user._id);

    res.status(200).json({ token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({  token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json();
  } catch (err) {
    console.log(err);
  }
};


module.exports.get_user = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};


module.exports.update_user = async (req, res) => {
  try {
    await User.updateOne({_id: req.user.id} , { $push: { guests: req.body } });
    res.status(200).json(req.body);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};



module.exports.remove_user_guest = async (req, res) => {
  try {
    await User.updateOne({_id: req.user.id} , { $pull: { guests: { _id: req.body._id } } });
    res.status(200).json(req.body);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};


