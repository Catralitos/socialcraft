const pathfinder = require('mineflayer-pathfinder').pathfinder
const {GoalNear} = require('mineflayer-pathfinder').goals
const Practice = require("../../../practice.js")

class GoToBar extends Practice {

    _socialGatheringPlace;
    _arrived;

    constructor(bot, agent, timeout = 20) {
        super(bot, "GoToBar", agent, timeout);
        this._targetPos = null
        this._arrived = false;
    }

    getSalience(context) {
        let village = Number.parseInt(this._agent._bed[3]) > 4
        if (!village) {
            return Number.NEGATIVE_INFINITY
        }
        let currentTimeOfDay = (this._bot.time.timeOfDay + 6000) % 24000
        return (currentTimeOfDay > 18000 && currentTimeOfDay < 19000) && context._location._name !== "Bar" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
    }

    setup(context) {
        this._socialGatheringPlace = context._database.getLocationByName("Bar")
    }

    start() {
        super.start()
        let centralPoint = this._socialGatheringPlace.getCentralPointFlat()
        let goal = new GoalNear(centralPoint.x, centralPoint.y, centralPoint.z, 1)
        this._bot.pathfinder.setGoal(goal)
    }

    update() {
        if (this._socialGatheringPlace.isInLocation(this._bot.entity.position)){
            this._arrived = true
        }
    }

    isPossible() {
        return this._socialGatheringPlace
    }

    hasEnded() {
        return super.hasEnded() || this._arrived;
    }

    exit() {
        super.exit()
        this._socialGatheringPlace = null;
        this._arrived = false;
        this._bot.pathfinder.setGoal(null);
    }
}

module.exports = {GoToBar};

