var population = require('population');
var creepUtil = require('creep.util');

var room = {
    populate: function() {
        creepUtil.cleanMemory();
        for (name of population.harvesters()) {
            if (Game.creeps[name] == undefined) {
                Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], name, {role: 'harvester'});
            }
        }
        for (name of population.upgraders()) {
            if (Game.creeps[name] == undefined) {
                Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], name, {role: 'upgrader'});
            }
        }
        for (name of population.builders()) {
            if (Game.creeps[name] == undefined) {
                Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], name, {role: 'builder'});
            }
        }
    },
    
    report: function() {
        function rep (creepType) {
            console.log('Number of ' + creepType + 's: ' + _(Game.creeps).filter({ memory: { role: creepType }}).size());
        };
        rep('harvester');
        rep('upgrader');
        rep('builder');
    }
};

module.exports = room;