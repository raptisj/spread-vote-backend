const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
	name: String,
	twitter_name: String,
	twitter_image: String,
	bio: String,
	podcast_id: [String],
	votes: {
		type: [String],
		default: []
	}
});

const Guest = mongoose.model('guest', guestSchema);

module.exports = Guest;
