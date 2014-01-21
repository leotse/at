///////////////
// market.js //
///////////////

// encapsulates the stock market
// streams data from the database and notify all participants of price changes
// participants will also be able to get the current quote of a stock price
var market = {};

// libs
var models = require('./models');
var stocks = {};

// updates market data
market.tick = function(quote) {
	if(!stocks[quote.symbol]) { stocks[quote.symbol] = quote; }
};

// get current market price of a stock
market.quote = function(symbol) {
	var stock = stocks[symbol];
	if(!stock) { return 0; }
	return stock.adjClose;
};


module.exports = market;