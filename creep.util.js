var creepUtil = {
    bodyCost: function (creep) {
        return creep.body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part.type];
        }, 0);
    },
    
    cleanMemory: function () {
        for(var i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    }
};

module.exports = creepUtil;