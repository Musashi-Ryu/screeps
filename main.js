var Room = require('room');
var Util = require('util');

module.exports.loop = function () {
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
}