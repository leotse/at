/////////////////////
// models/quote.js //
/////////////////////

// libs
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// schema
var schema = new Schema({

	symbol: { type: String, required: true },
	date: { type: Date, required: true },
	open: { type: Number, required: true },
	high: { type: Number, required: true },
	low: { type: Number, required: true },
	close: { type: Number, required: true },
	volume: { type: Number, required: true },
	adjClose: { type: Number, required: true }

}, { strict: true, versionKey: false });

// indexes
schema.index({ symbol: 1, date: -1 }, { unique: true });
schema.index({ date: 1 });

// export
module.exports = schema;