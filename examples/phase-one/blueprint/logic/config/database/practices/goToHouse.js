const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const {GoalNear} = require('mineflayer-pathfinder').goals
const Practice = require("../../../practice.js")
const {Vec3} = require("vec3");

class GoToHouse extends Practice {

    _targetBedPosition;

    constructor(bot, agent, timeout = 20) {
        super(bot, "GoToHouse", agent, timeout);
        this._targetBedPosition = null;
    }

    getSalience(context) {
        return 0.25
    }

    setup(context) {
        this._targetBedPosition = this._agent.getItemInKnowledgeBase("bed_position")
    }

    start() {
        super.start()
        let goal = new GoalNear(this._targetBedPosition.x, this._targetBedPosition.y, this._targetBedPosition.z, 0.5)
        this._bot.pathfinder.setGoal(goal);
    }

    update() {
        //pass
    }

    isPossible() {
        return true
    }

    hasEnded() {
        return super.hasEnded() || this._targetBedPosition.xzDistanceTo(this._bot.entity.position) < 1
    }

    exit() {
        super.exit()
        this._targetBedPosition = null;
        this._bot.pathfinder.setGoal(null);
    }
}
module.exports = {GoToHouse};
