/////////////////
// simulate.js //
/////////////////

// libs
var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var models = require('./models');
var TradingIntelligence = require('./intelligence');

// arguments
var start_date = "Jan 1, 2007"; // inclusive
var end_date = "Jan 1, 2009"; // exclusive

// start script!
async.waterfall([ models.connect, simulate ], completed);

function simulate() {
	var done = arguments[arguments.length - 1];

	var market = require('./market');

	// init trading intelligence
	var intelligence = new TradingIntelligence;

	// start streaming stock quotes
	var start = moment(start_date);
	var end = moment(end_date);
	var Quote = models.get('Quote');
	var stream = Quote.find()
		.where('date').gte(start.toDate())
		.where('date').lt(end.toDate())
		.sort('date')
		.stream();

	stream.on('error', done);
	stream.on('close', function() { done(null, intelligence); });
	stream.on('data', function(quote) {
		try {

			// update market
			market.tick(quote);

			// add knowledge to intelligence
			intelligence.tick(quote);

		} catch(ex) { console.log(ex.stack); }
	});
}

function completed(err, intelligence) {
	if(err) { throw err; }
	console.log(intelligence.holdings());
	process.exit();
}