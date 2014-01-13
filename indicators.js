///////////////////
// indicators.js //
///////////////////

// libs
var misc = require('./misc');
var ds = require('./data');
var RollingQueue = require('./data').RollingQueue;

// helper class to keep track of some basic technical indicators
module.exports = function TechnicalIndicators(opts) {
	var self = this;
	var history = new RollingQueue(200);
	var indicators = { sma50: 0, sma100: 0, sma200: 0 };

	// updates all enabled technical indicators
	// expects a quote object
	self.update = function(quote) {
		history.push(quote);

		indicators.sma50 = misc.avg(history.get(50, 'close'));
		indicators.sma100 = misc.avg(history.get(100, 'close'));
		indicators.sma200 = misc.avg(history.get(200, 'close'));
	};

	// returns all indicators as obj
	self.toObject = function() {
		return indicators;
	};
};