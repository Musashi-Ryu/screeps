var Room = require('room');
var Util = require('util');

module.exports.loop = function () {
    var room = new Room(Game.spawns['Spawn1'].room);
    room.loadCreeps();
    room.populate();
    
    /*
    var tower = Game.getObjectById('590514c03031099b2191e29b');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }*/
    
    console.log(
		room.room.name + 
		', population: ' +
		room.population.getTotalPopulation() + '/' + room.population.getMaxPopulation() +
		' (' + room.population.getType('Constructor').count + '/' +
		room.population.getType('Miner').count + '/' +
		room.population.getType('Carrier').count + 
		'), ' +
		'resources at: ' + parseInt( (room.depositController.energy() / room.depositController.energyCapacity())*100) +'%, ' +
		'max resources: ' + room.depositController.energyCapacity() +'u'
	);
	
	Util.garbageCollection();
}