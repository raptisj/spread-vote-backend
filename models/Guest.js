const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
	name: String,
	twitterName: String,
	twitterImage: String,
	bio: String,
	category: {
		type: [String],
		default: []
	},
	votes: {
		type: [String],
		default: []
	}
});

const Guest = mongoose.model('guest', guestSchema);

module.exports = Guest;
