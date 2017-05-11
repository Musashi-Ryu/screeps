var Cache = require('cache');

function ControllerConstruction(room) {
    this.room = room;
    this.cache = new Cache();
    this.sites = this.room.find(FIND_CONSTRUCTION_SITES);
    this.structures = this.room.find(FIND_MY_STRUCTURES);
    this.damagedStructures = this.getDamagedStructures();
    this.upgradeableStructures = this.getUpgradeableStructures();
    this.controller = this.room.controller;
};


ControllerConstruction.prototype.getDamagedStructures = function() {
    return this.cache.remember(
        'damaged-structures',
        function() {
            return this.room.find(
                FIND_STRUCTURES,
                {
                    filter: function(s) {
                        var targets = s.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
						if (targets.length != 0) {
						    return false;
						}
                        if (s.hits < (s.hitsMax - s.hitsMax / 10) && s.structureType != STRUCTURE_RAMPART 
                                && s.structureType != STRUCTURE_WALL) {
                            return true;
                        }
                    }
                }
            );
        }.bind(this)
    );
};

ControllerConstruction.prototype.getUpgradeableStructures = function() {
    return this.cache.remember(
        'upgradeable-structures',
        function() {
            return this.room.find(
                FIND_STRUCTURES,
                {
                    filter: function(s) {
                        var targets = s.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                        if(targets.length != 0) {
                            return false;
                        }
                        if(s.hits < s.hitsMax && s.structureType != STRUCTURE_ROAD 
                                                && s.structureType != STRUCTURE_CONTAINER) {
                            return true;
                        }
                    }
                }
            );
        }.bind(this)
    );
};

ControllerConstruction.prototype.getController = function() {
    return this.controller;
};

ControllerConstruction.prototype.getStorage = function() {
    return this.room.find(FIND_MY_STRUCTURES, { filter: function(s) {
        return s.structureType == STRUCTURE_STORAGE;
    }});
};

ControllerConstruction.prototype.getEmptyStorage = function() {
    var storages = this.getStorage();
    for (var storage of storages) {
        if (storage.store[RESOURCE_ENERGY] < storage.storeCapacity) {
            return storage;
        }
    }
    return false;
};

ControllerConstruction.prototype.getClosestConstructionSite = function(creep) {
    var site = false;
    if (this.sites.length != 0) {
        site = creep.pos.findClosest(this.sites);
    }

    return site;
};

ControllerConstruction.prototype.constructStructure = function(creep) {
    this.sites = this.room.find(FIND_CONSTRUCTION_SITES);
    this.structures = this.room.find(FIND_MY_STRUCTURES);
    this.damagedStructures = this.getDamagedStructures();
    this.upgradeableStructures = this.getUpgradeableStructures();
    
    var avoidArea = creep.getAvoidedArea();
    var site = false;
    
    if (this.damagedStructures.length != 0) {
        site = creep.creep.pos.findClosestByPath(this.damagedStructures);
        creep.creep.moveTo(site, {costCallback: avoidArea, visualizePathStyle: {stroke: '#4EB970', lineStyle: 'solid'}});
        creep.creep.repair(site);

        return site;
    }
    
    if(this.sites.length != 0) {
        site = creep.creep.pos.findClosestByPath(this.sites);
        creep.creep.moveTo(site, {costCallback: avoidArea, visualizePathStyle: {stroke: '#4EB970', lineStyle: 'solid'}});
        creep.creep.build(site);

        return site;
    }
    
    if(this.upgradeableStructures.length != 0) {
        //findlowesthp
        site = creep.creep.pos.findClosestByPath(this.upgradeableStructures);
        creep.creep.moveTo(site, {costCallback: avoidArea, visualizePathStyle: {stroke: '#4EB970', lineStyle: 'solid'}});
        creep.creep.repair(site);

        return site;
    }

    return false;
};

module.exports = ControllerConstruction;
