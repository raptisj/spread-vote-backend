const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
	name: String,
	about: String,
	guests: {
		type: [String],
		default: []
	}
});

const Podcast = mongoose.model('podcast', podcastSchema);

module.exports = Podcast;
