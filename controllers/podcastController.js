const Podcast = require('../models/Podcast');

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

		res.json(podcast);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

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
