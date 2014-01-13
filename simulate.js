/////////////////
// simulate.js //
/////////////////

// libs
var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var models = require('./models');
var TechnicalIndicators = require('./indicators');

// arguments
var start_date = "Jan 1, 2013";
var end_date = "Jan 1, 2014";

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

			// debug message
			var technical = indicators.toObject();
			console.log('%s,%s,%s,%s,%s', 
				moment(quote.date).format('L'), 
				quote.close.toFixed(2), 
				technical.sma50.toFixed(2), 
				technical.sma100.toFixed(2),
				technical.sma200.toFixed(2)
			);

		} catch(ex) { console.log(ex.stack); }
	});
}

function completed(err, indicators) {
	if(err) { throw err; }
	process.exit();
}