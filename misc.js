// misc.js //
/////////////

// random helpers
var misc = {};

// libs
var _ = require('underscore');

// helper to calculate the average of an array of numbers
misc.avg = function(numbers) {
	var memo = _.reduce(numbers, function(memo, number) {
		memo.avg = (memo.avg * memo.n + number) / (memo.n + 1);
		memo.n = memo.n + 1;
		return memo;
	}, { avg: 0, n: 0 });
	return memo.avg;
}

module.exports = misc;