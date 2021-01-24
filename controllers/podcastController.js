const Podcast = require('../models/Podcast');
const Guest = require('../models/Guest');

module.exports.all_podcasts = async (req, res) => {
	try {
		const podcast = await Podcast.find();
		res.json(podcast);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.single_podcast = async (req, res) => {
	try {
		const podcast = await Podcast.findById(req.params.id);

		const podcastGuests = await Guest.find({
			'_id': { $in: [podcast.guests]}
		});

		res.json({podcast, podcastGuests});
	} catch (err) {
		res.status(400).json({ message: err });
	}
};


// only for future admin  users
module.exports.create_podcast = async (req, res) => {
	const podcast = new Podcast({
		name: req.body.name,
		about: req.body.about,
		guests: req.body.guests,
		category: req.body.category
	});

	try {
		const savedPodcasts = await podcast.save();
		res.json(savedPodcasts);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};
