var Room = require('room');
var Util = require('util');

module.exports.loop = function () {
    var room = new Room(Game.rooms['E18N81']);
    room.loadCreeps();
    room.populate();
    room.activateTowers();
    
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