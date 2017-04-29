var Population = require('population');
var ControllerDeposit = require('controller.deposit');
var ControllerResource = require('controller.resource');
var ControllerConstruction = require('controller.construction');
var FactoryCreep = require('factory.creep')

function Room(room)  {
    this.room = room;
    this.creeps = [];
    this.population = new Population(this.room);
    this.depositController = new ControllerDeposit(this.room);
    this.resourceController = new ControllerResource(this.room, this.population);
    this.constructionController = new ControllerConstruction(this.room);
    this.creepFactory = new FactoryCreep(this.depositController, this.resourceController, this.constructionController, this.population);
};

Room.prototype.populate = function() {
    for (var i = 0; i < this.depositController.spawns.length; i++) {
        var spawn = this.depositController.spawns[i];
        if (spawn.spawning) {
            continue;
        }
        
        if ((this.depositController.energy() / this.depositController.energyCapacity()) > 0.2) {
            var types = this.population.getTypes();
            for (var i = 0; i < types.length; i++) {
                var ctype = this.population.getType(types[i]);
                if (this.depositController.deposits.length > ctype.minExtensions) {
                    if (ctype.count < ctype.max || ctype.count == 0) {
                        this.creepFactory.new(types[i], this.depositController.getSpawnDeposit());
                        break;
                    }
                }
            }
        }
    }
};

Room.prototype.loadCreeps = function() {
	var creeps = this.room.find(FIND_MY_CREEPS);
	for (var n in creeps) {
		var c = this.creepFactory.load(creeps[n]);
		if (c) {
			this.creeps.push(c);
		}
	}
	this.distributeConstructors();
	this.distributeResources('Miner');
	this.distributeResources('Carrier');
	this.distributeCarriers();
};

Room.prototype.distributeConstructors = function() {
	var builderStats = this.population.getType('Constructor');
	if (this.depositController.spawns.length == 0) {
		for (var i = 0; i < this.creeps.length; i++) {
			var creep = this.creeps[i];
			if (creep.remember('role') != 'Constructor') {
				continue;
			}

			creep.remember('forceControllerUpgrade', false);
		}
		return;
	}
	if (builderStats <= 3) {
		for (var i = 0; i < this.creeps.length; i++) {
			var creep = this.creeps[i];
			if (creep.remember('role') != 'Constructor') {
				continue;
			}
			creep.remember('forceControllerUpgrade', false);
		}
	} else {
		var c = 0;
		for (var i = 0; i < this.creeps.length; i++) {
			var creep = this.creeps[i];
			if (creep.remember('role') != 'Constructor') {
				continue;
			}
			creep.remember('forceControllerUpgrade', true);
			c++;
			if (c == 2) {
				break;
			}
		}
	}
}

Room.prototype.distributeCarriers = function() {
	var counter = 0;
	var builders = [];
	var carriers = [];
	for (var i = 0; i < this.creeps.length; i++) {
		var creep = this.creeps[i];
		if (creep.remember('role') == 'Constructor') {
			builders.push(creep.creep);
		}
		if (creep.remember('role') != 'Carrier') {
			continue;
		}
		carriers.push(creep);
		if(!creep.getDepositFor()) {
			if(counter%2) {
				// Construction
				creep.setDepositFor(1);
			} else {
				// Population
				creep.setDepositFor(2);
			}
		}

		counter++;
	}
	counter = 0;
	for (var i = 0; i < carriers.length; i++) {
		var creep = carriers[i];
		if (creep.remember('role') != 'Carrier') {
			continue;
		}
		if (!builders[counter]) {
			continue;
		}
		var id = creep.remember('target-worker');
		if (!Game.getObjectById(id)) {
			creep.remember('target-worker', builders[counter].id);
		}
		counter++;
		if (counter >= builders.length) {
			counter = 0;
		}
	}
};

Room.prototype.distributeResources = function(type) {
	var sources = this.resourceController.getSources();
	var perSource = Math.ceil(this.population.getType(type).total/sources.length);
	var counter = 0;
	var source = 0;

	for (var i = 0; i < this.creeps.length; i++) {
		var creep = this.creeps[i];
		if (creep.remember('role') != type) {
			continue;
		}

		if (!sources[source]) {
			continue;
		}

		creep.remember('source', sources[source].id);
		counter++;
		if (counter >= perSource) {
			counter = 0;
			source++;
		}
	}
};

module.exports = Room;