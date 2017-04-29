var Cache = require('cache');

var ACTIONS = {
	HARVEST: 1,
	DEPOSIT: 2
};

function CreepMiner(creep, resourceController) {
	this.cache = new Cache();
	this.creep = creep;
	this.resourceController = resourceController;
	this.resource = false;
	this.container = false;
};

CreepMiner.prototype.init = function() {
	this.remember('role', 'Miner');
	
	if (!this.remember('container')) {
		var cnt = this.resourceController.getAvailableContainer();
		if (cnt != undefined) {
		    this.remember('container', cnt.id);
		}
	} else {
	    this.container = this.resourceController.getResourceById(this.remember('container'));
	}
	
	if (this.remember('source') == undefined) {
		var source = this.resourceController.getAvailableResource();
		if (source != undefined) {
		    this.remember('source', source.id);
		}
	} else {
        this.resource = this.resourceController.getResourceById(this.remember('source'));
	}
	
	if (!this.remember('srcRoom')) {
		this.remember('srcRoom', this.creep.room.name);
	}
	if (this.moveToNewRoom() == true) {
		return;
	}

	this.act();
};

CreepMiner.prototype.act = function() {
	var avoidArea = this.getAvoidedArea();
	
	if (this.creep.energy == this.creep.energyCapacity) {
		//return;
	}
	if (this.container) {
    	if (this.creep.pos.getRangeTo(this.container) == 0) { 
            this.resource = this.creep.pos.findClosestByPath(FIND_SOURCES); 
            this.creep.harvest(this.resource);
            this.creep.transfer(this.container, RESOURCE_ENERGY);
        } 
        else { 
            this.creep.moveTo(this.container, {costCallback: avoidArea, visualizePathStyle: {stroke: '#F1C41A', lineStyle: 'solid'}});
        }
	} else {
	    if (this.creep.pos.getRangeTo(this.resource) == 1) { 
            this.resource = this.creep.pos.findClosestByPath(FIND_SOURCES); 
            this.creep.harvest(this.resource);
        } 
        else { 
            this.creep.moveTo(this.resource, {costCallback: avoidArea, visualizePathStyle: {stroke: '#F1C41A', lineStyle: 'solid'}});
        }
	}
	
	this.remember('last-energy', this.creep.energy);
}

CreepMiner.prototype.giveEnergy = function() {
	var creepsNear = this.creep.pos.findInRange(FIND_MY_CREEPS, 1);
	if (creepsNear.length){
		for (var n in creepsNear){
			if (creepsNear[n].memory.role === 'Miner'){
				if (creepsNear[n].memory['last-energy'] == creepsNear[n].energy && creepsNear[n].energy < creepsNear[n].energyCapacity) {
					this.creep.transfer(creepsNear[n], RESOURCE_ENERGY);
				}
			}
		}
	}
}

module.exports = CreepMiner;
