const mongoose = require('mongoose');

// guests schema here
const guestSchema = new mongoose.Schema({
	name: String,
	twitter_name: String,
	twitter_image: String,
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
	votes: Number,
	category: String
});

const Podcast = mongoose.model('podcast', podcastSchema);

module.exports = Podcast;
