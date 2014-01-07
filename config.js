///////////////
// config.js //
///////////////

var config = {};
var env = process.env.NODE_ENV;

if(env === 'production') {

	// prod config
	// config.db = 'mongodb://localhost:27017/at';
	
} else {

	// dev config
	config.db = 'mongodb://localhost:27017/at';
}

module.exports = config;