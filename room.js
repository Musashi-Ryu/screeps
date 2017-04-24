var creepUtil = require('creepUtil');
var room = {
    renew: function(creep) {
        var bodySize = creep.body.length;
        var renewCost = Math.ceil(creepUtil.bodyCost(creep.body)/2.5/bodySize);
        //console.log(renewCost);
    }
};

module.exports = room;