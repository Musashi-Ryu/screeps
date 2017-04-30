var Cache = require('cache');

function ControllerResource(room, population) {
	this.cache = new Cache();
	this.room = room;
	this.population = population;
};

ControllerResource.prototype.getAvailableResource = function() {
	var srcs = this.getSources(this.room);
	var freeSource = [];
	for (var s of srcs) {
       var creepsNear = s.pos.findInRange(FIND_MY_CREEPS, 1, {
				filter: function(creep) {
					return (creep.memory.role == 'Miner');
				}
			});
        if (creepsNear.length == 0) {
            freeSource.push(s);
        }
	}
	return freeSource[0];
};

ControllerResource.prototype.getSources = function(room) {
	return this.cache.remember(
		'sources',
		function() {
			return this.room.find(FIND_SOURCES, {
				filter: function(src) {
					var targets = src.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
					if (targets.length == 0) {
						return true;
					}

					return false;
				}
			});
		}.bind(this)
	);
};

ControllerResource.prototype.getAvailableContainer = function() {
	var conts = this.getContainers(this.room);
	var freeConts = [];
	for (var c of conts) {
        var creepsNear = c.pos.findInRange(FIND_MY_CREEPS, 0, {
				filter: function(creep) {
					return (creep.memory.role == 'Miner');
				}
			});
        if (creepsNear.length == 0) {
            freeConts.push(c);
        }
	}
	return freeConts[0];
};

ControllerResource.prototype.getContainers = function(room) {
	return this.cache.remember(
		'containers',
		function() {
			return this.room.find(FIND_STRUCTURES, {
				filter: function(structure) {
					return (structure.structureType == STRUCTURE_CONTAINER);
				}
			});
		}.bind(this)
	);
};

ControllerResource.prototype.getResourceById = function(id) {
	return Game.getObjectById(id);
};

module.exports = ControllerResource;