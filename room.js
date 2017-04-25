var creepUtil = require('creepUtil');
var population = require('population');

var room = {
    populate: function() {
        for (name of population.harvesters()) {
            if (Game.creeps[name] == undefined) {
                Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], name, {role: 'harvester'});
            }
        }
        for (name of population.upgraders()) {
            if (Game.creeps[name] == undefined) {
                Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], name, {role: 'upgrader'});
            }
        }
        for (name of population.builders()) {
            if (Game.creeps[name] == undefined) {
                Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], name, {role: 'builder'});
            }
        }
    }
};

module.exports = room;