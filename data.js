/////////////
// data.js //
/////////////

// common data structures used in the simulation
var data = {};

// libs
var _ = require('underscore');

// a rolling queue implementation
data.RollingQueue = function(maxSize) {
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
};

module.exports = data;