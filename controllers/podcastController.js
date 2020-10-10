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
		// const allGuests = await Guest.find();
		// let po = allGuests.filter((p) => p.podcast_id === req.params.id && p.votes.length > 0);
		// console.log(po);
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
		votes: req.body.votes
	});

	try {
		const savedPodcasts = await podcast.save();
		res.json(savedPodcasts);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.update_podcast = async (req, res) => {
	try {
		const updatedVotes = await Podcast.updateOne(
			{ _id: req.params.id },
			{
				$set: {
					votes: req.body.length
				}
			}
		);
		res.status(200).json(updatedVotes);
	} catch (err) {
		console.log(err);
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};
