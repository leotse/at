/////////////////////
// intelligence.js //
/////////////////////

// encapsulates the intelligence agent
// takes a quote and executes trades when appropriate
// this is where the bulk of the algorithm will reside

// libs
var _ = require('underscore');
var Portfolio = require('./portfolio');
var TechnicalIndicators = require('./indicators');

// main trading intelligence
module.exports = function TradingIntelligence() {
	var self = this;
	var stocks = {};
	var portfolio = new Portfolio;

	// expects quote input json with properties
	// symbol, date, close, volume
	self.tick = function(quote) {

		// keep track of new stock
		if(!stocks[quote.symbol]) { 
			stocks[quote.symbol] = new Stock(quote.symbol); 
		}

		// tell stock about new price change
		var stock = stocks[quote.symbol];
		stock.tick(quote);

		// see if there are trade signals
		var signals = stock.signals();

		// trade based on the signals
		_.each(signals, function(signal) {
			if(signal.action === 'buy') {
				portfolio.long(quote.symbol, 1);
			} else {	
				portfolio.short(quote.symbol, 1);
			}
		});
	};

	// returns the current holdings
	self.holdings = function() { 
		return { 
			holdings: portfolio.report(),
			market: portfolio.market()
		}; 
	};
};

// helper class to encapsulate a stocks
function Stock(symbol) {
	if(!symbol) { throw new Error("stock symbol required"); }

	// init
	var self = this;
	var indicators = new TechnicalIndicators;

	// main method to monitor changes in stock
	self.tick = function(quote) {
		if(quote.symbol !== symbol) { return; }
		indicators.tick(quote);
	};

	// main method to see if there are signals based on the current knowledge 
	self.signals = function() {
		var ind = indicators.toObject();
		var sma50 = ind.sma50;
		var sma100 = ind.sma100;
		var sma200 = ind.sma200;

		// don't even start thinking until indicators are populated
		if(sma200 === 0) { return; }

		// find signals
		var signals = [];

		// 50-200 ma signals
		if(sma50 < sma200) { signals.push({ symbol: symbol, action: 'sell', strength: 'strong', type: 'ma_50_200' }); }
		else if(sma50 > sma200) { signals.push({ symbol: symbol, action: 'buy', strength: 'strong', type: 'ma_50_200' }); }

		return signals;
	};
}