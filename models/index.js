/////////////////////
// models/index.js //
/////////////////////

var models = {};

// libs
var mongoose = require('mongoose');
var Quote = require('./quote');
var config = require('../config');

// register models
mongoose.model('Quote', Quote);

// export method to connect to db
module.exports = {
	connect: function(callback) { mongoose.connect(config.db, callback); },
	get: function(name) { return mongoose.model(name); }
};