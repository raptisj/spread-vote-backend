const Guest = require('../models/Guest');
const Podcast = require('../models/Podcast');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const webscraping = require('../utils/scraper');
const { sortTrending } = require('../utils/helperFunctions');

// handle errors
const handleErrors = (err) => {
	console.log(err.message, err.code);
	let errors = { email: '', password: '' };

	// incorrect email
	if (err.message === 'incorrect email') {
		errors.email = 'Email is not registered';
	}

	// incorrect password
	if (err.message === 'incorrect password') {
		errors.password = 'Password is incorrect';
	}

	// validation errors
	if (err.message.includes('user validation failed')) {
		// console.log(err);
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

module.exports.all_guests = async (req, res) => {
	let trending = req.query.trending;

	try {
		const podcast = await Podcast.findById(req.params.podId);

		res.json(trending ? sortTrending(podcast.guests) : podcast.guests);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.single_guest = async (req, res) => {
	try {
		const podcast = await Podcast.findById(req.params.podId);
		const singleGuest = podcast.guests.id(req.params.id);

		res.json(singleGuest);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.fetch_twitter_data = async (req, res) => {
	const twitterData = await webscraping(req.body.name);

	console.log(twitterData);

	const podcast = await Podcast.findById(req.params.podId);
	let guestExists = podcast.guests.filter((guest) => guest['twitter_name'] === twitterData.twitter_name);

	try {
		res.status(200).json(guestExists.length === 0 ? twitterData : guestExists[0]);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.create_guest = async (req, res) => {
	const podcast = new Podcast();
	const podcastGuests = podcast.guests.create({
		name: req.body.name,
		twitter_name: req.body.twitter_name,
		twitter_image: req.body.twitter_image,
		bio: req.body.bio,
		podcast_id: req.body.podcast_id,
		podcast_name: req.body.podcast_name,
		votes: req.body.votes
	});

	try {
		const createdPodcast = await Podcast.updateOne(
			{ _id: req.body.podcast_id },
			{ $push: { guests: podcastGuests }, $set: { votes: podcastGuests.votes.length } }
		);
		const singlePodcast = await Podcast.findById(req.body.podcast_id);

		res.json(singlePodcast);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.upVote_guest = async (req, res) => {
	try {
		const updatedPodcast = await Podcast.updateOne(
			{ _id: req.body.podcastId, 'guests._id': req.params.id },
			{ $push: { 'guests.$.votes': req.body.votes } }
		);
		console.log(req.body.votes);
		const podcast = await Podcast.findById(req.body.podcastId);

		res.status(200).json(podcast);
	} catch (err) {
		console.log(err);
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.unVote_guest = async (req, res) => {
	try {
		const updatedPodcast = await Podcast.updateOne(
			{ _id: req.body.podcastId, 'guests._id': req.params.id },
			{ $pull: { 'guests.$.votes': { $in: req.body.votes } } }
		);

		const podcast = await Podcast.findById(req.body.podcastId);
		console.log(req.body.votes);

		res.status(200).json(podcast);
	} catch (err) {
		console.log(err);
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.vote_category = async (req, res) => {
	try {
		// await Podcast.updateOne(
		// 	{ _id: req.params.podId, 'category.users': req.body.userId },
		// 	{ $pull: { 'category.$.users': { $in: [req.body.userId] } } }
		// );

		// await Podcast.updateOne(
		// 	{ _id: req.params.podId, 'category.id': req.body.currentCategory },
		// 	{ $push: { 'category.$.users': req.body.userId } }
		// );

		const podcastWithUser = await Podcast.findById(req.params.podId);
		// const upd = podcastWithUser.category.filter(
		// 	(p) => p.users.includes(req.body.userId) && p.id === req.body.currentCategory
		// );
		// console.log(upd);

		const findId = (data, id) => {
			const index = data.indexOf(id);
			if (index > -1) {
				data.splice(index, 1);
				return data;
			}
		};

		const po = podcastWithUser.category.map((p) => ({
			...p,
			users:
				p.users.includes(req.body.userId) && p.id !== req.body.currentCategory
					? findId(p.users, req.body.userId)
					: !p.users.includes(req.body.userId)
					? [...p.users]
					: [...p.users, 2]
		}));
		console.log(po, '1');
		// users: p.users.includes(req.body.userId) && p.id !== req.body.currentCategory ? [] : [...users] }
		// const updatedCategories = po.map((p) => ({ ...p, value: p.users.length }));
		// console.log(updatedCategories, '2');

		// await Podcast.updateOne({ _id: req.params.podId }, { $set: { category: updatedCategories } });
		// await User.updateOne({ _id: req.body.userId }, { $set: { category: req.body.currentCategory } });

		// const podcast = await Podcast.findById(req.params.podId);
		// res.status(200).json(podcast);
	} catch (err) {
		console.log(err);
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

// const sortTrending = (data) => {
// 	return data
// 		.sort(function (a, b) {
// 			if (a.votes.length < b.votes.length) {
// 				return 1;
// 			}
// 			if (a.votes.length > b.votes.length) {
// 				return -1;
// 			}
// 			return 0;
// 		})
// 		.slice(0, 5);
// };
