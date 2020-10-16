const mongoose = require('mongoose');

// guests schema here
const guestSchema = new mongoose.Schema({
	name: String,
	twitterName: String,
	twitterImage: String,
	bio: String,
	podcast_id: String,
	podcast_name: String,
	votes: {
		type: [String],
		default: []
	}
});

const podcastSchema = new mongoose.Schema({
	name: String,
	about: String,
	guests: {
		type: [guestSchema],
		default: []
	},
	votes: Number
});

const Podcast = mongoose.model('podcast', podcastSchema);

module.exports = Podcast;
