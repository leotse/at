/////////////////
// simulate.js //
/////////////////

// libs
var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var models = require('./models');
var EventEmitter = require('events').EventEmitter;

// arguments
var start_date = "Jan 1, 2012";
var end_date = "Jan 1, 2013";

// start script!
async.waterfall([ models.connect, simulate ], completed);

function simulate() {
	var done = arguments[arguments.length - 1];

	// keep track of key indicators
	var indicators = new TechnicalIndicators;

	// start streaming stock quotes
	var start = moment(start_date);
	var end = moment(end_date);
	var Quote = models.get('Quote');
	var stream = Quote.find()
		.where('symbol', 'AAPL')
		.where('date').gte(start.toDate())
		.where('date').lt(end.toDate())
		.sort('date')
		.stream();

	stream.on('error', done);
	stream.on('close', function() { done(null, indicators); });
	stream.on('data', function(quote) {
		try {

			indicators.update(quote);
			
		} catch(ex) { console.log(ex); }
	});
}

function completed(err, indicators) {
	if(err) { throw err; }
	process.exit();
}

/////////////
// Helpers //
/////////////

// helper class to calculate key metrics
function TechnicalIndicators() {
	var self = this;
	var history = new RollingQueue(200);
	var indicators = { sma50: 0, sma100: 0, sma200: 0 };

	// updates all enabled technical indicators
	// expects a quote object
	self.update = function(quote) {
		history.push(quote);

		indicators.sma50 = avg(history.get(50, 'close'));
		indicators.sma100 = avg(history.get(100, 'close'));
		indicators.sma200 = avg(history.get(200, 'close'));

		// debug message
		console.log('%s,%s,%s,%s,%s', 
			moment(quote.date).format('L'), 
			quote.close.toFixed(2), 
			indicators.sma50.toFixed(2), 
			indicators.sma100.toFixed(2),
			indicators.sma200.toFixed(2)
		);
	};

	// returns all indicators as obj
	self.toObject = function() {
		return indicators;
	};
}

// helper to calculate the average of an array of numbers
function avg(numbers) {
	var memo = _.reduce(numbers, function(memo, number) {
		memo.avg = (memo.avg * memo.n + number) / (memo.n + 1);
		memo.n = memo.n + 1;
		return memo;
	}, { avg: 0, n: 0 });
	return memo.avg;
}

// helper class to keep the latest n quotes
function RollingQueue(maxSize) {
	var self = this;
	var queue = [];

	// add items to the queue
	// if the queue exceeds max size oldest item gets automatically removed
	self.push = function(thing) {
		queue.push(thing);
		if(queue.length > maxSize) { queue.shift(); }
	};

	// get the latest n items from the queue
	self.get = function(n, field) {
		var start = (n > queue.length) ? 0 : queue.length - n;
		var things = queue.slice(start);

		if(field) {
			return _.map(things, function(thing) { 
				return thing[field]; 
			});
		}
		return things;
	};
}