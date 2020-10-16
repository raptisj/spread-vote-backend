module.exports = const sortTrending = (data) => {
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

export const isEmpty = (value) =>
	value === undefined ||
	value === null ||
	(typeof value === 'object' && Object.keys(value).length === 0) ||
	(typeof value === 'string' && value.trim().length === 0);
