var Cache = require('cache');

function StructureTower(room) {
    this.cache = new Cache();
    this.room = room;
    this.towers = this.getTowers();
};

StructureTower.prototype.init = function() {
    this.act();
};

StructureTower.prototype.act = function() {
    this.repairAll();
    this.attackEnemy();
};

StructureTower.prototype.repairAll = function() {
    for (t of this.towers) {
        var closestDamagedStructure = t.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            t.repair(closestDamagedStructure);
        }
    }
};

StructureTower.prototype.attackEnemy = function() {
    for (t of this.towers) {
        var closestHostile = t.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            t.attack(closestHostile);
        }
    }
}

StructureTower.prototype.getTowers = function() {
    return this.cache.remember(
		'towers',
		function() {
            return this.room.find(FIND_MY_STRUCTURES, {filter: function(s) { return s.structureType == STRUCTURE_TOWER; }});
		}.bind(this)
	);
};

StructureTower.prototype.getTowersLowEnergy = function() {
    var result = [];
    for (var t of this.towers) {
        if (t.energy < t.energyCapacity - (t.energyCapacity / 4)) {
            result.push(t);
        }
    }
    
    return result;
};

module.exports = StructureTower;