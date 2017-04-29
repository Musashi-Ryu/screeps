var Room = require('room');
var Util = require('util');

module.exports.loop = function () {
<<<<<<< HEAD
    var room = new Room(Game.spawns['Spawn1'].room);
    room.loadCreeps();
    room.populate();
    
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
=======
    room.report();
    room.populate();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
>>>>>>> ad599f6b484c63a0589191d1dfc5994105439abc
}