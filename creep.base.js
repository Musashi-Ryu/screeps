var Cache = require('cache');

var CreepBase = {};
var universalCache = new Cache();

CreepBase.remember = function(key, value) {
	if (value === undefined) {
		return this.creep.memory[key];
	}

	this.creep.memory[key] = value;

	return value;
}

CreepBase.forget = function(key) {
	delete this.creep.memory[key];
}

CreepBase.getAvoidedArea = function() {
	var positions = universalCache.remember(
		'avoid-enemies-' + this.creep.room.name,
		function() {
			var calculateArea = function(x,y) {
				var avoidPosArray= [];

			    for(var n = -4; n < 4; n++) {
			        for(var i = -4; i < 4; i++) {
			            avoidPosArray.push({
			                x: x+n,
			                y: y+i
			            });
			        }
			    }

				return avoidPosArray;
			};

			var avoidPosArray= [];
			var enemies = this.creep.room.find(FIND_HOSTILE_CREEPS, {
				filter: function(t) {
					if (t.owner.username == 'Source Keeper') {
						return true;
					}
					return false;
				}
			});

			for (var i = 0; i < enemies.length; i++) {
				var startPosX = enemies[i].pos.x;
				var startPosY = enemies[i].pos.y;
				var positions = calculateArea(startPosX, startPosY);
				for (var n = 0; n < positions.length; n++) {
					avoidPosArray.push(
						this.creep.room.getPositionAt(positions[n].x, positions[n].y)
					);
				}
			}

			return avoidPosArray;
		}.bind(this)
	)

	return positions;
};

CreepBase.randomMovement = function() {
	var avoidArea = this.getAvoidedArea();
	if (!this.remember('temp-pos')) {
		this.remember('temp-pos', {x:parseInt(Math.random()*50), y:parseInt(Math.random()*50)});
	}
	if (!this.remember('last-pos')) {
		this.remember('last-pos', {x:0, y:0});
	}
	if (!this.remember('last-energy')) {
		this.remember('last-energy', 0);
	}
	if (!this.remember('move-counter')) {
		this.remember('move-counter', 0);
	}
	if (!this.remember('move-attempts')) {
		this.remember('move-attempts', 0);
	}

	var moveCounter = this.remember('move-counter');
	var moveAttempts = this.remember('move-attempts');
	var lastEnergy = this.remember('last-energy');
	var tempPos = this.remember('temp-pos');
	var lastPos = this.remember('last-pos');
	var currPos = this.creep.pos;

	if (lastEnergy != this.creep.energy) {
		moveAttempts = this.remember('move-attempts', 0);
	}

	if (lastPos.x == currPos.x && lastPos.y == currPos.y && this.creep.fatigue == 0) {
		moveAttempts++;
		if (moveAttempts >= 7) {
			moveAttempts = 0;
			moveCounter = 3;
		}
		this.remember('move-attempts', moveAttempts)
		this.remember('move-counter', moveCounter)
	}

	if (moveCounter) {
		moveCounter--;
		this.remember('move-counter', moveCounter);
		this.creep.moveTo(tempPos.x, tempPos.y, {costCallback: avoidArea});
		if (this.onRandomMovement) {
			this.onRandomMovement();
		}
		return true;
	}

	this.remember('last-pos', {x:this.creep.pos.x, y:this.creep.pos.y});
	this.remember('last-energy', this.creep.energy);

	return false;
};

CreepBase.moveToNewRoom = function() {
	var targetRoom = this.remember('targetRoom');
	var srcRoom = this.remember('srcRoom');

	if (targetRoom) {
		if (targetRoom != this.creep.room.name) {
			var exitDir = this.creep.room.findExitTo(targetRoom);
			var exit = this.creep.pos.findClosest(exitDir);
			this.creep.moveTo(exit);
			return true;
		} else {
			this.creep.moveTo(30,30);
			var targetRoom = this.remember('targetRoom', false);
			var srcRoom = this.remember('srcRoom', this.creep.room.name);
		}
	} else {
		return false;
	}
};

CreepBase.swapPosition = function(creep1, creep2) {
    //why no swap??
    var pos1 = creep1.pos;
    var pos2 = creep2.pos;
    
            console.log(creep1.name);
            console.log(creep2.name);
            console.log(pos1);
            console.log(pos2);
    creep2.moveTo(pos1);
    creep1.moveTo(pos2);
    creep2.moveTo(pos1);
};

CreepBase.getCreepAt = function(creep, direction) {
    var targetPos = false;
    var found = [];
    
    switch(direction) {
        case TOP:
                targetPos = new RoomPosition(creep.pos.x, creep.pos.y - 1, creep.room.name);
                found = creep.room.lookForAt(LOOK_CREEPS, targetPos);
            break;
        case TOP_RIGHT:
                targetPos = new RoomPosition(creep.pos.x + 1, creep.pos.y - 1, creep.room.name);
                found = creep.room.lookForAt(LOOK_CREEPS, targetPos);
            break;
        case RIGHT:
                targetPos = new RoomPosition(creep.pos.x + 1, creep.pos.y, creep.room.name);
                found = creep.room.lookForAt(LOOK_CREEPS, targetPos);
            break;
        case BOTTOM_RIGHT:
                targetPos = new RoomPosition(creep.pos.x + 1, creep.pos.y + 1, creep.room.name);
                found = creep.room.lookForAt(LOOK_CREEPS, targetPos);
            break;
        case BOTTOM:
                targetPos = new RoomPosition(creep.pos.x, creep.pos.y + 1, creep.room.name);
                found = creep.room.lookForAt(LOOK_CREEPS, targetPos);
            break;
        case BOTTOM_LEFT:
                targetPos = new RoomPosition(creep.pos.x - 1, creep.pos.y + 1, creep.room.name);
                found = creep.room.lookForAt(LOOK_CREEPS, targetPos);
            break;
        case LEFT:
                targetPos = new RoomPosition(creep.pos.x - 1, creep.pos.y, creep.room.name);
                found = creep.room.lookForAt(LOOK_CREEPS, targetPos);
            break;
        case TOP_LEFT:
                targetPos = new RoomPosition(creep.pos.x - 1, creep.pos.y - 1, creep.room.name);
                found = creep.room.lookForAt(LOOK_CREEPS, targetPos);
            break;
    }
    if (found.length) {
        return found[0];
    }
    else {
        return false;
    }
};

module.exports = CreepBase;
