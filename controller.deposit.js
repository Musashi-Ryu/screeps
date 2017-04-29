var Cache = require('cache');
var CONSTANTS = {
    EMPTY: 0.5
};

function ControllerDeposit(room) {
    this.cache = new Cache();
    this.room = room;
    this.deposits = this.room.find(
        FIND_MY_STRUCTURES,
        {
            filter: filterExtensions
        }
    );
    
    this.spawns = [];
    for (var s in Game.spawns) {
        var spawn = Game.spawns[s];
        if (spawn.room == this.room) {
            this.spawns.push(spawn);
        }
    }
};

ControllerDeposit.prototype.getSpawnDeposit = function() {
    if (this.spawns.length != 0) {
        return this.spawns[0];
    }
    
    return false;
};

ControllerDeposit.prototype.isEmptyDeposit = function(deposit) {
    if (deposit.energy / deposit.energyCapacity < CONSTANTS.EMPTY) {
        return true;
    }
    
    return false;
};

ControllerDeposit.prototype.getClosestEmptyDeposit = function(creep) {
    var deposits = this.getEmptyDeposits();
    var deposit = false;
    if (deposits.length != 0) {
        deposit = creep.pos.findClosestByPath(deposits);
    }
    if (!deposit) {
        deposit = this.getSpawnDeposit();
    }
    
    return deposit;
};

ControllerDeposit.prototype.getEmptyDeposits = function() {
    return this.cache.remember(
        'empty-deposits',
        function() {
            var result = [];
            for (var i = 0; i < this.deposits.length; i++) {
                var temp = this.deposits[i];
                if (this.isEmptyDeposit(temp)) {
                    result.push(temp);
                }
            }
            
            return result;
        }.bind(this)
    );
};

ControllerDeposit.prototype.getEmptyDepositOnId = function(id) {
	var deposit = Game.getObjectById(id);

	if (deposit && this.isEmptyDeposit(deposit)) {
		return deposit;
	}

	return false;
};

ControllerDeposit.prototype.getFullDeposits = function() {
    return this.cache.remember(
        'deposits-full',
        function() {
            var result = [];
            var deposits = this.deposits;
            for (var i = 0; i < deposits.length; i++) {
                var deposit = deposits[i];
                if (deposit.energy == deposit.energyCapacity) {
                    result.push(deposit);
                }
            }
            
            return result;
        }.bind(this)
    );
};

ControllerDeposit.prototype.energy = function() {
	return this.cache.remember(
		'deposits-energy',
		function() {
			var energy = 0;
			var deposits = this.deposits;
			for (var i = 0; i < deposits.length; i++) {
				var deposit = deposits[i];
				energy += deposit.energy;
			}

			for (var i = 0; i < this.spawns.length; i++) {
				energy += this.spawns[i].energy;
			}

			return energy;
		}.bind(this)
	);
};

ControllerDeposit.prototype.energyCapacity = function() {
    return this.cache.remember(
        'deposits-energy-capacity',
        function() {
            var energyCapacity = 0;
            var deposits = this.deposits;
            for (var i = 0; i < deposits.length; i++) {
                var deposit = deposits[i];
                energyCapacity += deposit.energyCapacity;
            }
            
            for (var i = 0; i < this.spawns.length; i++) {
                energyCapacity += this.spawns[i].energyCapacity;
            }
            
            return energyCapacity;
        }.bind(this)
    );
};

function filterExtensions(structure) {
    if(structure.structureType == STRUCTURE_EXTENSION) {
        return true;
    }
    
    return false;
};

module.exports = ControllerDeposit;