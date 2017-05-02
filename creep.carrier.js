var Cache = require('cache');
var Util = require('util');

var ACTIONS = {
	HARVEST: 1,
	DEPOSIT: 2
};
var DEPOSIT_FOR = {
	CONSTRUCTION: 1,
	POPULATION: 2
}

function CreepCarrier(creep, depositController, resourceController, constructionsController) {
	this.cache = new Cache();
	this.creep = creep;
	this.depositController = depositController;
	this.resourceController = resourceController;
	this.constructionsController = constructionsController;
	this.resource = false;
	this.target = false;
	this.container = false;
};

CreepCarrier.prototype.init = function() {
	this.remember('role', 'Carrier');
	this.depositFor = this.remember('depositFor') || 2;
	
	if (!this.remember('container')) {
		var containers = this.resourceController.getContainers(this.creep.room);
		if (containers.length) {
		    var rand = Util.getRandomInt(0,1);
		    var container = containers[rand];
		    if (this.resourceController.hasMiner(container) && !this.resourceController.isEmpty(container)) {
	            this.remember('container', container.id);
		    }
		}
	} else {
		this.container = this.resourceController.getResourceById(this.remember('container'));
	}
	
	if (!this.remember('source')) {
		var sources = this.resourceController.getSources(this.creep.room);
	    this.remember('source', sources[Util.getRandomInt(0,1)].id);
	} else {
		this.resource = this.resourceController.getResourceById(this.remember('source'));
	}
	
	if (!this.remember('srcRoom')) {
		this.remember('srcRoom', this.creep.room.name);
	}

	if (this.moveToNewRoom() == true) {
		return;
	}

	if (this.randomMovement() == false) {
	    this.act();
	}
};

CreepCarrier.prototype.onRandomMovement = function() {
	this.remember('last-action', ACTIONS.DEPOSIT);
}

CreepCarrier.prototype.setDepositFor = function(type) {
	this.remember('depositFor', type);
}
CreepCarrier.prototype.getDepositFor = function() {
	return this.remember('depositFor');
}

CreepCarrier.prototype.act = function() {
    var continueDeposit = false;
	if (this.creep.carry.energy != 0 && this.remember('last-action') == ACTIONS.DEPOSIT) {
		continueDeposit = true;
	}
	this.pickupEnergy();
	if (this.creep.carry.energy < this.creep.carryCapacity && continueDeposit == false) {
		this.harvestEnergy();
	} else {
		this.depositEnergy();
	}
};

CreepCarrier.prototype.depositEnergy = function() {
	var avoidArea = this.getAvoidedArea();
	if (this.depositController.getEmptyDeposits().length == 0 && this.depositController.getSpawnDeposit().energy == this.depositController.getSpawnDeposit().energyCapacity) {
		this.depositFor = DEPOSIT_FOR.CONSTRUCTION;
	}

	if (this.depositController.energy() / this.depositController.energyCapacity() < 0.3) {
		this.depositFor = DEPOSIT_FOR.POPULATION;
	}

	if (this.depositFor == DEPOSIT_FOR.POPULATION) {
		var deposit = this.getDeposit();
		this.creep.moveTo(deposit, {costCallback: avoidArea, visualizePathStyle: {stroke: '#3B96D4', lineStyle: 'solid'}});
		this.creep.transfer(deposit, RESOURCE_ENERGY);
	}
	if (this.depositFor == DEPOSIT_FOR.CONSTRUCTION) {
		var worker = this.getWorker();
		var range = 1;
		if (!worker) {
			worker = this.constructionsController.controller;
			range = 2;
		}

		if (!this.creep.pos.isNearTo(worker, range)) {
			this.creep.moveTo(worker, {costCallback: avoidArea, visualizePathStyle: {stroke: '#3B96D4', lineStyle: 'solid'}});
		} else {
			this.remember('move-attempts', 0);
		}
		if (worker.structureType == 'tower') {
		    this.creep.transfer(worker, RESOURCE_ENERGY);
		} else {
		    this.harvest();
		}
	}

	this.remember('last-action', ACTIONS.DEPOSIT);
}

CreepCarrier.prototype.getWorker = function() {
	if (this.remember('target-worker')) {
		return Game.getObjectById(this.remember('target-worker'));
	}

	return false;
}

CreepCarrier.prototype.getDeposit = function() {
	return this.cache.remember(
		'selected-deposit',
		function() {
			var deposit = false;

			// Deposit energy
			if (this.remember('closest-deposit')) {
				deposit = this.depositController.getEmptyDepositOnId(this.remember('closest-deposit'));
			}

			if (!deposit) {
				deposit = this.depositController.getClosestEmptyDeposit(this.creep);
				this.remember('closest-deposit', deposit.id);
			}

			if (!deposit) {
				deposit = this.depositController.getSpawnDeposit();
			}

			return deposit;
		}.bind(this)
	)
};

CreepCarrier.prototype.pickupEnergy = function() {
	var avoidArea = this.getAvoidedArea();

	var target = this.creep.pos.findInRange(FIND_DROPPED_ENERGY, 2);
	if (target != undefined) {
	    if (this.creep.pickup(target[0]) == ERR_NOT_IN_RANGE) {
	        this.creep.moveTo(target[0], {costCallback: avoidArea, visualizePathStyle: {stroke: '#3B96D4', lineStyle: 'dashed'}});
	    }
	}
};

CreepCarrier.prototype.harvestEnergy = function() {
	var avoidArea = this.getAvoidedArea();

	if (this.container) {
    	if (this.creep.pos.inRangeTo(this.container, 1)) {
    		this.harvest();
    	} else {
    	    this.creep.moveTo(this.container, {costCallback: avoidArea, visualizePathStyle: {stroke: '#3B96D4', lineStyle: 'dashed'}});
    	}
	} else {
	    if (this.creep.pos.inRangeTo(this.resource, 2)) {
    		this.harvest();
    	} else {
    	    this.creep.moveTo(this.resource, {costCallback: avoidArea, visualizePathStyle: {stroke: '#3B96D4', lineStyle: 'dashed'}});
    	}
	}
	
	this.remember('last-action', ACTIONS.HARVEST);
	this.forget('closest-deposit');
};

CreepCarrier.prototype.harvest = function() {
	if (this.creep.pos.inRangeTo(this.container, 1)) {
		this.creep.withdraw(this.container, RESOURCE_ENERGY);
	} else {
    	var creepsNear = this.creep.pos.findInRange(FIND_MY_CREEPS, 1);
    	if (creepsNear.length){
    		for (var n in creepsNear){
    			if (creepsNear[n].memory.role === 'Miner' && creepsNear[n].energy != 0){
    				creepsNear[n].transfer(this.creep, RESOURCE_ENERGY);
    			}
                if (creepsNear[n].memory.role === 'Constructor'){
                    this.creep.transfer(creepsNear[n], RESOURCE_ENERGY);
    			}
    		}
    	}
    	
	}
};

module.exports = CreepCarrier;
