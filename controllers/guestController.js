const Guest = require('../models/Guest');
const jwt = require('jsonwebtoken');
const webscraping = require('../utils/scraper');

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
		const guests = await Guest.find();
		res.json(trending ? sortTrending(guests) : guests);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.single_guest = async (req, res) => {
	try {
		const guest = await Guest.findById(req.params.id);
		res.json(guest);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.fetch_twitter_data = async (req, res) => {
	const twitterData = await webscraping(req.body.name);
	try {
		res.status(200).json(twitterData);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

module.exports.create_guest = async (req, res) => {
	// console.log(req.body);
	const guest = new Guest({
		name: req.body.name,
		twitterName: req.body.twitterName,
		twitterImage: req.body.twitterImage,
		bio: req.body.bio,
		category: req.body.category,
		votes: req.body.votes
	});

	console.log(guest);
	try {
		const savedGuest = await guest.save();
		res.json(savedGuest);
	} catch (err) {
		res.status(400).json({ message: err });
	}
};

// votes is an array of user ids.
module.exports.upVote_guest = async (req, res) => {
	try {
		const updatedVotes = await Guest.updateOne({ _id: req.params.id }, { $push: { votes: req.body.votes } });
		const guest = await Guest.findById(req.params.id);

		res.status(200).json(guest);
	} catch (err) {
		console.log(err);
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.unVote_guest = async (req, res) => {
	try {
		const updatedVotes = await Guest.updateOne({ _id: req.params.id }, { $pull: { votes: { $in: req.body.votes } } });
		const guest = await Guest.findById(req.params.id);
		res.status(200).json(guest);
	} catch (err) {
		console.log(err);
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

const sortTrending = (data) => {
	return data
		.sort(function (a, b) {
			if (a.votes.length < b.votes.length) {
				return 1;
			}
			if (a.votes.length > b.votes.length) {
				return -1;
			}
			return 0;
		})
		.slice(0, 5);
};
