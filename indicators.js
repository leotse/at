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
	self.tick = function(quote) {
		history.push(quote);

		var a50 = history.get(50, 'adjClose');
		if(a50.length < 50) { indicators.sma50 = 0; }
		else { indicators.sma50 = misc.avg(history.get(50, 'adjClose')); }

		var a100 = history.get(100, 'adjClose');
		if(a100.length < 100) { indicators.sma100 = 0; }
		else { indicators.sma100 = misc.avg(history.get(100, 'adjClose')); }

		var a200 = history.get(200, 'adjClose');
		if(a200.length < 200) { indicators.sma200 = 0; }
		else { indicators.sma200 = misc.avg(history.get(200, 'adjClose')); }
	};

	// returns all indicators as obj
	self.toObject = function() {
		return indicators;
	};
};