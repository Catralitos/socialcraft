const pathfinder = require('mineflayer-pathfinder').pathfinder
const {GoalNearXZ} = require('mineflayer-pathfinder').goals
const Practice = require("../../../practice.js")

class GoToWork extends Practice {

    _targetPos;
    _arrived;

    constructor(bot, agent, timeout = 20) {
        super(bot, "GoToWork", agent, timeout);
        this._targetPos = null
        this._arrived = false;
    }

    getSalience(context) {
        return this._agent._current_job.onTheJob(this._agent._bot.time.timeOfDay) && this._agent._current_job._location
        && context._location !== this._agent._current_job._location ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }

    setup(context) {
        this._targetPos = this._agent._current_job._location.getCentralPoint()
    }

    start() {
        super.start()
        let goal = new GoalNearXZ(this._targetPos.x, this._targetPos.z, 1)
        this._bot.pathfinder.setGoal(goal)
    }

    update() {
        if (this._agent._current_job._location.isInLocation(this._bot.entity.position)){
            this._arrived = true
        }
    }

    isPossible() {
        return this._targetPos
    }

    hasEnded() {
        return super.hasEnded() || this._arrived;
    }

    exit() {
        super.exit()
        this._targetPos = null;
        this._arrived = false;
        this._bot.pathfinder.setGoal(null);
    }
}

module.exports = {GoToWork};

