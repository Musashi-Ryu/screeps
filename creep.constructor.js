var CreepConstructor = function(creep, depositController, constructionController) {
	this.creep = creep;
	this.depositController = depositController;
	this.constructionController = constructionController;
	this.forceControllerUpgrade = false;
};

CreepConstructor.prototype.init = function() {
	this.remember('role', 'Constructor');
	if (!this.remember('srcRoom')) {
		this.remember('srcRoom', this.creep.room.name);
	}

	if (this.moveToNewRoom() == true) {
		return;
	}

	this.forceControllerUpgrade = this.remember('forceControllerUpgrade');

	//if (this.randomMovement() == false) {
		this.act();
	//}
};

CreepConstructor.prototype.act = function() {
	var site = false;
	var avoidArea = this.getAvoidedArea();
	if (!this.forceControllerUpgrade) {
		site = this.constructionController.constructStructure(this);
	}
	
	if (!site) {
		var site = this.constructionController.getController();
		var storage = site.pos.findClosestByPath(FIND_MY_STRUCTURES, {
		    filter: function(s) {
                return s.structureType == STRUCTURE_STORAGE;
            }
		});
        this.creep.moveTo(storage, {costCallback: avoidArea, visualizePathStyle: {stroke: '#4EB970', lineStyle: 'dashed'}});
        if (this.creep.carry.energy == 0) {
            this.getEnergyFromStorage(storage);
        } else {
            if (this.creep.upgradeController(site) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(site, {costCallback: avoidArea, visualizePathStyle: {stroke: '#4EB970', lineStyle: 'dashed'}});
            }
            
        }
	}

	if (this.creep.pos.inRangeTo(site, 2)) {
		this.giveEnergy(site);
	}
	this.remember('last-energy', this.creep.energy);
};

CreepConstructor.prototype.getEnergyFromStorage = function(storage) {
    this.creep.withdraw(storage, RESOURCE_ENERGY);
};

CreepConstructor.prototype.giveEnergy = function(site) {
	var creepsNear = this.creep.pos.findInRange(FIND_MY_CREEPS, 1);
	if (creepsNear.length){
		if (site) {
			var closest = site.pos.findClosestByPath(creepsNear.concat(this.creep),{
				filter: function(c) {
					if (c.energy == 0) {
						return true;
					}
				}
			});

			if (closest != this.creep) {
				this.creep.transfer(closest, RESOURCE_ENERGY);
			}
			return;
		}
		for (var n in creepsNear){
			if (creepsNear[n].memory.role === 'Constructor'){
				if (creepsNear[n].memory['last-energy'] > creepsNear[n].energy) {
					this.creep.transfer(creepsNear[n], RESOURCE_ENERGY);
				}
			}
		}
	}
};

module.exports = CreepConstructor;
