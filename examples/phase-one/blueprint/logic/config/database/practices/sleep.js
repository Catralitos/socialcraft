const Practice = require("../../../practice.js")
const {Vec3} = require("vec3");
const pathfinder = require('mineflayer-pathfinder').pathfinder
const {GoalNear} = require('mineflayer-pathfinder').goals
const Movements = require('mineflayer-pathfinder').Movements

/*
Daytime

Daytime is the longest section of the cycle, lasting 10 minutes.

Start: 0 ticks (06:00:00.0)
Mid: 6000 ticks (12:00:00.0)
End: 12000 ticks (18:00:00.0)
*/

/*
Sunset/dusk

Sunset is the period between daytime and nighttime, and always lasts 50 seconds.

Start: 12000 ticks (18:00:00.0)
End: 13000 ticks (19:00:00.0)
 */

/*
Nighttime

Start: 13000 ticks (19:00:00.0)
Mid: 18000 ticks (00:00:00.0)
End: 23000 ticks (05:00:00.0)
 */

/*
Sunrise/dawn

Sunrise is the period between nighttime and daytime, and always lasts 50 seconds.

Start: 23000 ticks (05:00:00.0)
End: 24000 (0) ticks (06:00:00.0)
*/

class Sleep extends Practice {

    _targetBedPosition;
    _beganSleep;

    constructor(bot, agent, timeout = 20) {
        super(bot, "Sleep", agent, timeout);
        this._targetBedPosition = null;
    }

    getSalience(context) {
        let actualTicks = this._bot.time.timeOfDay
        if (actualTicks >= 13000 && actualTicks <= 23000) {
            return Number.POSITIVE_INFINITY
        } else {
            return Number.NEGATIVE_INFINITY
        }
    }

    setup(context) {
        this._targetBedPosition = this._agent.getItemInKnowledgeBase("bed_position")
    }

    start() {
        super.start()
        //this._bot.chat("I am going to sleep")
        const mcData = require('minecraft-data')(this._bot.version)
        const defaultMove = new Movements(this._bot, mcData)
        defaultMove.canDig = false
        defaultMove.allow1by1towers = false;
        defaultMove.allowFreeMotion = true;
        let goal = new GoalNear(this._targetBedPosition.x, this._targetBedPosition.y, this._targetBedPosition.z, 1)
        this._bot.pathfinder.setMovements(defaultMove)
        this._bot.pathfinder.setGoal(goal, true)
    }

    update() {
        if (this._targetBedPosition.distanceTo(this._bot.entity.position) < 2) {
            this._bot.chat("Good night!")
            this._bot.sleep(this._bot.blockAt(this._targetBedPosition))
            this._beganSleep = true;
        }
    }

    isPossible() {
        let actualTicks = this._bot.time.timeOfDay
        return !this._bot.isSleeping && ((actualTicks >= 13000 && actualTicks < 23000) || this._bot.thunderState > 0) &&
            this._targetBedPosition !== null && this._targetBedPosition !== undefined;
    }

    hasEnded() {
        return (!this._bot.isSleeping && this._beganSleep)
    }

    exit() {
        super.exit();
        this._beganSleep = false;
    }
}

module.exports = {Sleep};