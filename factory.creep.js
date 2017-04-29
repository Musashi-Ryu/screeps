var Util = require('util');
var CreepBase = require('creep.base');
var CreepMiner = require('creep.miner');
var CreepCarrier = require('creep.carrier');
var CreepConstructor = require('creep.constructor');

function FactoryCreep(depositController, resourceController, constructionController, population) {
	this.depositController = depositController;
	this.resourceController = resourceController;
	this.constructionController = constructionController;
	this.population = population;
};

FactoryCreep.prototype.load = function(creep) {
	var loadedCreep = null;
	var role = creep.memory.role;
	if (!role) {
		role = creep.name.split('-')[0];
	}

	switch(role) {
		case 'Constructor':
			loadedCreep = new CreepConstructor(creep, this.depositController, this.constructionController);
		break;
		case 'Miner':
			loadedCreep = new CreepMiner(creep, this.resourceController);
		break;
		case 'Carrier':
			loadedCreep = new CreepCarrier(creep, this.depositController, this.resourceController, this.constructionController);
		break;
	}

	if (!loadedCreep) {
		return false;
	}

	Util.extend(loadedCreep, CreepBase);
	loadedCreep.init();

	return loadedCreep;
};

FactoryCreep.prototype.new = function(creepType, spawn) {
	var abilities = [];
	var id = new Date().getTime();
	var creepLevel = this.population.getTotalPopulation() / this.population.populationLevelMultiplier;
	var resourceLevel = this.depositController.getFullDeposits().length / 5;
	var level = Math.floor(creepLevel + resourceLevel);
	if (this.population.getTotalPopulation() < 5){
		level = 1;
	}
	// TOUGH          10
	// MOVE           50
	// CARRY          50
	// ATTACK         80
	// WORK           100
	// RANGED_ATTACK  150
	// HEAL           200

	switch(creepType) {
		case 'Miner':
			if (level <= 1) {
				abilities = [WORK, WORK, WORK, WORK, MOVE];
			} else
			if (level <= 2) {
				abilities = [WORK, WORK, WORK, WORK, MOVE];
			} else
			if (level <= 3) {
				abilities = [WORK, WORK, WORK, WORK, MOVE];
			} else
			if (level <= 4) {
				abilities = [WORK, WORK, WORK, WORK, MOVE];
			} else
			if (level <= 5) {
				abilities = [WORK, WORK, WORK, WORK, MOVE];
			} else
			if (level <= 6) {
				abilities = [WORK, WORK, WORK, WORK, WORK, MOVE];
			} else
			if (level <= 7) {
				abilities = [WORK, WORK, WORK, WORK, WORK, MOVE];
			} else
			if (level <= 8) {
				abilities = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE];
			} else
			if (level <= 9) {
				abilities = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE];
			} else
			if (level >= 10) {
				abilities = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE];
			}
		break;
		case 'Constructor':
			if (level <= 1) {
				abilities = [WORK, CARRY, MOVE];
			} else
			if (level <= 2) {
				abilities = [WORK, WORK, CARRY, MOVE];
			} else
			if (level <= 3) {
				abilities = [WORK, WORK, CARRY, MOVE, MOVE];
			} else
			if (level <= 4) {
				abilities = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
			} else
			if (level <= 5) {
				abilities = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
			} else
			if (level <= 6) {
				abilities = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
			} else
			if (level <= 7) {
				abilities = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
			} else
			if (level <= 8) {
				abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
			} else
			if (level <= 9) {
				abilities = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
			} else
			if (level >= 10) {
				abilities = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
			}
		break;
		case 'Carrier':
			if (level <= 1) {
				abilities = [CARRY, MOVE];
			} else
			if (level <= 2) {
				abilities = [CARRY, CARRY, MOVE];
			} else
			if (level <= 3) {
				abilities = [CARRY, CARRY, MOVE, MOVE];
			} else
			if (level <= 4) {
				abilities = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
			} else
			if (level <= 5) {
				abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
			} else
			if (level <= 6) {
				abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
			} else
			if (level <= 7) {
				abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
			} else
			if (level <= 8) {
				abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
			} else
			if (level <= 9) {
				abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
			} else
			if (level >= 10) {
				abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,  CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
			}
		break;
	}

	var canBuild = spawn.canCreateCreep(
		abilities,
		creepType + '-' + id,
		{
			role: creepType
		}
	);
	if (canBuild !== 0) {
		console.log('Can not build creep: ' + creepType + ' @ ' + level);
		return;
	}
	
	console.log('Spawn level ' + level + ' ' + creepType + '(' + creepLevel + '/' + resourceLevel + ')');
	if (creepType == 'Miner' || creepType == 'Carrier') {
		var i = this.population.getType(creepType).count % 2;
		spawn.createCreep(abilities, creepType + '-' + id, {role: creepType, containerNo: i});
	} else {		
		spawn.createCreep(abilities, creepType + '-' + id, {role: creepType});
	}
};

module.exports = FactoryCreep;
