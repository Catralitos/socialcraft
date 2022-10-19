const Practice = require("../../../practice");
const pathfinder = require('mineflayer-pathfinder')
const {GoalBlock} = require('mineflayer-pathfinder').goals
const minecraftData = require('minecraft-data')
const mcData = minecraftData('1.12')

class Fish extends Practice {

    _doneFishing;

    constructor(bot, agent, timeout = 20) {
        super(bot, "Fish", agent, timeout);
        this._targetFishingSpot = null
        this._doneFishing = false
    }

    getSalience(context) {
        return this._agent._current_job._name === "Fisher"
        && this._agent._current_job.onTheJob(this._agent._bot.time.timeOfDay) &&
           this._agent._current_job._location === context._location ? 2 : Number.NEGATIVE_INFINITY;
    }

    setup(context) {
        this._targetFishingSpot = this._agent._current_job._location
    }

    start() {
        super.start()
        this._bot.equip(mcData.itemsByName["fishing_rod"], "hand").then()
        this._bot.fish().then(r => this._doneFishing = true)
    }

    isPossible() {
        return true
    }

    hasEnded() {
        return super.hasEnded() || this._doneFishing
    }

    exit() {
        super.exit();
        this._doneFishing = false
        this._bot.unequip("hand").then()

    }
}

module.exports = {Fish}