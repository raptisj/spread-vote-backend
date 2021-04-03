const mongoose = require('mongoose');

const imgSrc = 'https://img.favpng.com/22/13/24/disk-green-circle-png-favpng-3F6U9MeHGHMTjpQQa3uhewVhx.jpg';

const guestSchema = new mongoose.Schema({
	name: String,
	bio: {
		type: String,
		default: ''
	},
	avatar: {
    type: String,
    default: imgSrc
  },
	userId: String,
	state: {
		type: String,
		default: 'hidden'
	},
	votes: {
		type: [String],
		default: []
	},
	tags: {
		type: [String],
		default: []
	},
	social: {
		type: Object,
		default: { website: '', twitter: ''}
	}
});

const Guest = mongoose.model('guest', guestSchema);

module.exports = Guest;
