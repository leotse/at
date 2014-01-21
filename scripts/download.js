/////////////////
// download.js //
/////////////////

// libs
var async = require('async');
var yf = require('yahoo-finance');
var models = require('../models');

// arguments
// var symbols = ['AAPL', 'BJRI', 'BRK-B', 'DAR', 'DDD', 'DIS', 'NOV', 'SBUX', 'WFM'];
var symbols = ['C' ];
var from = null; var to = null;
// var from = '2013-01-01';
// var to = '2013-01-05';

// start script
async.auto({ 
	connect: connect,
	download: [ 'connect', download ],
	insert: [ 'download', insert ],
}, completed);

// connect to db
function connect(done) { models.connect(done); }

// download quotes
function download(done) {
	async.map(symbols, d, done);
	function d(symbol, done) {
		yf.historical({ symbol: symbol, from: from, to: to }, done);
	}
}

// insert quotes
function insert(done, results) {
	var allquotes = results.download;
	async.eachSeries(allquotes, d, done);
	function d(quotes, done) {
		var Quote = models.get('Quote');
		Quote.collection.insert(quotes, done);
	}
}

// dome!
function completed(err, result) {
	if(err) { throw err; }
	console.log('completed!');
	process.exit();
}