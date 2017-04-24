var creepUtil = {
    bodyCost: function(body) {
        return body.reduce(function (cost, part) {
            
            console.log(BODYPART_COST[part]);
            return cost + BODYPART_COST[part];
        }, 0);
    }
};

module.exports = creepUtil;