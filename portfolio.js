//////////////////
// portfolio.js //
//////////////////

// represents a equity porfolio
// keeps track of all equity holdings and executes trades based on current stock price

// libs
var _ = require('underscore');
var models = require('./models');
var market = require('./market');

// class logic
module.exports = function Portfolio() {

	// init
	var self = this;
	var holdings = {};

	// to take a long position in an equity at the current market price
	self.long = function(symbol, shares) {
		if(!holdings[symbol]) { holdings[symbol] = { symbol: symbol, trades: [] }; }

		var holding = holdings[symbol];
		var price = market.quote(symbol);
		holding.trades.push({ shares: shares, price: price });
	};

	// to take a short position in an equity
	self.short = function(symbol, shares) {
		if(!holdings[symbol]) { holdings[symbol] = { symbol: symbol, trades: [] }; }

		var holding = holdings[symbol];
		var price = market.quote(symbol);
		holding.trades.push({ shares: -shares, price: price });
	};

	// holdings report
	self.report = function() {
		var value, shares, report = [];
		_.each(holdings, function(holding, symbol) {
			value = 0, shares = 0;
			_.each(holding.trades, function(trade) {
				shares += trade.shares;
				value += (trade.shares * trade.price);
			});
			report.push({ symbol: symbol, shares: shares, price: value / shares, book: value });
		});
		return report;
	};

	// market value report
	self.market = function() {
		var shares, report = [];
		_.each(holdings, function(holding, symbol) {
			shares = _.reduce(holding.trades, function(memo, trade) { return memo + trade.shares }, 0);
			report.push({ 
				symbol: symbol, 
				market: market.quote(symbol) * shares
			});
		});
		return report;
	};

	// returns the current holdings
	self.toObject = function() { return holdings; };
};