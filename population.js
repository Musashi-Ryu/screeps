<<<<<<< HEAD
var Cache = require('cache');

function Population(room) {
    this.cache = new Cache();
    this.room = room;
    this.populationLevelMultiplier = 8;
    this.types = {
        Miner: {
            count: 0,
            max: 2,
            minExtensions: 0
        },
        Carrier: {
            count: 0,
            max: 12,
            minExtensions: 0
        },
        Constructor: {
            count: 0,
            max: 6,
            minExtensions: 0
        }
    };
    
    this.creeps = this.room.find(FIND_MY_CREEPS);
    
    for(var i = 0; i < this.creeps.length; i++) {
		var creepType = this.creeps[i].memory.role;
		this.types[creepType].count++;
	}
};

Population.prototype.getType = function(type) {
    return this.types[type];
};

Population.prototype.getTypes = function() {
	var types = [];
	for(var n in this.types) {
		types.push(n);
	}
	return types;
};

Population.prototype.getTotalPopulation = function() {
    return this.creeps.length;
};

Population.prototype.getMaxPopulation = function() {
	return this.cache.remember(
		'max-population',
		function() {
			var population = 0;
			for (var n in this.types) {
				population += this.types[n].max;
			}
			return population;
		}.bind(this)
	);
};

module.exports = Population;
=======
var population = {
    harvesters: function() {
        return [
            "harvester1",
            "harvester2",
            "harvester3"
            ];
    },
    upgraders: function() {
        return [
            "upgrader1",
            "upgrader2",
            "upgrader3"
            ];
    },
    builders: function() {
        return [
            "builder1",
            "builder2",
            "builder3"
            ];
    }
};

module.exports = population;
>>>>>>> ad599f6b484c63a0589191d1dfc5994105439abc
