const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const imgSrc = 'https://img.favpng.com/22/13/24/disk-green-circle-png-favpng-3F6U9MeHGHMTjpQQa3uhewVhx.jpg';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Please enter name']
  },
  avatar: {
    type: String,
    default: imgSrc
  },
  guestId: {
    type: String,
		default: null
  },
  podcastId: {
    type: String,
		default: null
  },
  profileActive: {
    type: Boolean,
    default: false
  },
	podcastActive: {
    type: Boolean,
    default: false
  },
  social: {
		type: Object,
		default: { website: '', twitter: ''}
	}
});

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
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
