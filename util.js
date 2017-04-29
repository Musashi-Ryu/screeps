var Util = {};
Util.extend = function(target, source) {
	for(var property in source) {
		if(!source.hasOwnProperty(property)) {
			continue;
		}
		if(target.hasOwnProperty(property)) {
			continue;
		}

		target[property] = source[property];
	}
};

Util.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Util.garbageCollection = function() {
	for (var creep in Memory.creeps) {
		var c = Game.creeps[creep];
		if (!c) {
			delete Memory.creeps[creep];
		}
	}
}

module.exports = Util;