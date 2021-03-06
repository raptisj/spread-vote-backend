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
	try {
		const guests = await Guest.find({ state: 'published' });

		res.json(guests);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.single_guest = async (req, res) => {
	try {
		const singleGuest = await Guest.find({ userId: req.params.id });

		res.json({ singleGuest: singleGuest[0] });
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.update_user_guest = async (req, res) => {
	try {
		await Guest.updateOne({ _id: req.params.id },
			{ $set: { name: req.body.name, social: req.body.social, bio: req.body.bio } });
		await User.updateOne({ _id: req.body.userId }, { $set: { social: req.body.social, name: req.body.name } });

		const guest = await Guest.findById(req.params.id);
		const user = await User.findById(req.body.userId);

		res.json({ guest, user });
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

// module.exports.fetch_twitter_data = async (req, res) => {
// 	const twitterData = await webscraping(req.body.name);

// 	const podcast = await Podcast.findById(req.params.podId);
// 	let guestExists = podcast.guests.filter((guest) => guest['twitter_name'] === twitterData.twitter_name);

// 	try {
// 		res.status(200).json(guestExists.length === 0 ? twitterData : guestExists[0]);
// 	} catch (err) {
// 		res.status(400).json({ message: err });
// 	}
// };

// module.exports.create_guest = async (req, res) => {
// 	const guests = await Guest.find();
// 	const existingGuest = guests.filter((p) => p.twitter_name === req.body.twitter_name);
// 	let newGuest;

// 	if (existingGuest.length === 0) {
// 		newGuest = new Guest({
// 			name: req.body.name,
// 			twitter_name: req.body.twitter_name,
// 			twitter_image: req.body.twitter_image,
// 			bio: req.body.bio,
// 			podcasts: [req.body.podcasts[0]],
// 		});
// 	}

// 	// if (existingGuest.length && !existingGuest[0].podcast_id.includes(req.body.podcast_id)) {
// 	// 	newGuest = {
// 	// 		votes: existingGuest[0].votes,
// 	// 		_id: existingGuest[0]._id,
// 	// 		name: existingGuest[0].name,
// 	// 		twitter_name: existingGuest[0].twitter_name,
// 	// 		twitter_image: existingGuest[0].twitter_image,
// 	// 		bio: existingGuest[0].bio,
// 	// 		// podcast_id: [...existingGuest[0].podcast_id, req.body.podcast_id],
// 	// 		podcasts: [req.body.podcasts[0]],
// 	// 	};
// 	// }

// 	// if (existingGuest.length && existingGuest[0].podcast_id.includes(req.body.podcast_id)) {
// 	// 	console.log('it is')
// 	// }
// 	console.log(req.body)
// 	// console.log(newGuest, '2')


// 	try {
// 		if (existingGuest.length === 0) {
// 			await newGuest.save();
// 		} else {
// 			// await Guest.updateOne({ _id: existingGuest[0]._id }, { $set: newGuest });
// 		}

// 		const po = {
// 			id: newGuest._id,
// 			name: newGuest.name,
// 		}

// 		// console.log(po, '3')

// 		await Podcast.updateOne(
// 			{ _id: req.body.podcasts[0].id },
// 			{ $push: { guests: po } }
// 		);

// 		res.json(newGuest);
// 	} catch (err) {
// 		res.status(400).json({ message: err });
// 	}
// };

// module.exports.fetch_update_twitter_data = async (req, res) => {
// 	const twitterData = await webscraping(req.body.name);

// 	const podcast = await Podcast.findById(req.params.podId);
// 	const getGuest = podcast.guests.filter((guest) => guest['twitter_name'] === twitterData.twitter_name);

// 	const updatedGuest = {
// 		name: getGuest[0].name,
// 		twitter_name: getGuest[0].twitter_name,
// 		_id: getGuest[0]._id,
// 		twitter_image: twitterData.twitter_image,
// 		bio: twitterData.bio,
// 		podcast_id: getGuest[0].podcast_id,
// 		podcast_name: getGuest[0].podcast_name,
// 		votes: getGuest[0].votes
// 	};

// 	try {
// 		const updatedPodcast = await Podcast.updateOne(
// 			{ _id: req.params.podId, 'guests._id': getGuest[0]._id },
// 			{ $set: { 'guests.$': updatedGuest } }
// 		);

// 		const singlePodcast = await Podcast.findById(req.params.podId);

// 		res.json(singlePodcast);
// 	} catch (err) {
// 		res.status(400).json({ message: err });
// 	}
// };

// module.exports.upVote_guest = async (req, res) => {
// 	try {
// 		const updatedPodcast = await Podcast.updateOne(
// 			{ _id: req.body.podcastId, 'guests._id': req.params.id },
// 			{ $push: { 'guests.$.votes': req.body.votes } }
// 		);
// 		// console.log(req.body.votes);
// 		const podcast = await Podcast.findById(req.body.podcastId);

// 		res.status(200).json(podcast);
// 	} catch (err) {
// 		console.log(err);
// 		const errors = handleErrors(err);
// 		res.status(400).json({ errors });
// 		res.redirect('auth/login');
// 	}
// };

// module.exports.unVote_guest = async (req, res) => {
// 	try {
// 		// await Podcast.updateOne(
// 		// 	{ _id: req.body.podcastId },
// 		// 	{ $pull: { 'guests': { $in: req.params.id } } }
// 		// );

// 		await Guest.updateOne(
// 			{ _id: req.body.guestId },
// 			{ $pull: { 'votes': { $in: req.body.userId } } }
// 		);

// 		const podcast = await Podcast.findById(req.body.podcastId);

// 		res.status(200).json(podcast);
// 	} catch (err) {
// 		console.log(err);
// 		const errors = handleErrors(err);
// 		res.status(400).json({ errors });
// 	}
// };

// module.exports.vote_category = async (req, res) => {
// 	try {
// 		// await Podcast.updateOne(
// 		// 	{ _id: req.params.podId, 'category.users': req.body.userId },
// 		// 	{ $pull: { 'category.$.users': { $in: [req.body.userId] } } }
// 		// );

// 		// await Podcast.updateOne(
// 		// 	{ _id: req.params.podId, 'category.id': req.body.currentCategory },
// 		// 	{ $push: { 'category.$.users': req.body.userId } }
// 		// );

// 		const podcastWithUser = await Podcast.findById(req.params.podId);
// 		// const upd = podcastWithUser.category.filter(
// 		// 	(p) => p.users.includes(req.body.userId) && p.id === req.body.currentCategory
// 		// );
// 		// console.log(upd);

// 		const findId = (data, id) => {
// 			const index = data.indexOf(id);
// 			if (index > -1) {
// 				data.splice(index, 1);
// 				return data;
// 			}
// 		};

// 		const po = podcastWithUser.category.map((p) => ({
// 			...p,
// 			users:
// 				p.users.includes(req.body.userId) && p.id !== req.body.currentCategory
// 					? findId(p.users, req.body.userId)
// 					: !p.users.includes(req.body.userId)
// 					? [...p.users]
// 					: [...p.users, 2]
// 		}));
// 		console.log(po, '1');
// 		// users: p.users.includes(req.body.userId) && p.id !== req.body.currentCategory ? [] : [...users] }
// 		// const updatedCategories = po.map((p) => ({ ...p, value: p.users.length }));
// 		// console.log(updatedCategories, '2');

// 		// await Podcast.updateOne({ _id: req.params.podId }, { $set: { category: updatedCategories } });
// 		// await User.updateOne({ _id: req.body.userId }, { $set: { category: req.body.currentCategory } });

// 		// const podcast = await Podcast.findById(req.params.podId);
// 		// res.status(200).json(podcast);
// 	} catch (err) {
// 		console.log(err);
// 		const errors = handleErrors(err);
// 		res.status(400).json({ errors });
// 	}
// };

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
