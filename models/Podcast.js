const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
	name: String,
	bio: String,
	userId: String,
	guests: {
		type: [String],
		default: []
	},
	votes: String,
	tags: {
		type: [String],
		default: []
	},
	social: {
		type: Object,
		default: { website: '', twitter: ''}
	}
});

const Podcast = mongoose.model('podcast', podcastSchema);

module.exports = Podcast;
