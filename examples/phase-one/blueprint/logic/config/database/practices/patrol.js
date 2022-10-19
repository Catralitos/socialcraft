const Practice = require("../../../practice");
const minecraftData = require('minecraft-data')
const mcData = minecraftData('1.12')
const pathfinder = require('mineflayer-pathfinder')
const {GoalNearXZ} = require('mineflayer-pathfinder').goals

class Patrol extends Practice {

    _index;
    _loopDone
    _patrolLocation;
    _nextPatrolPoint;

    constructor(bot, agent, timeout = 20) {
        super(bot, "Patrol", agent, timeout);
        this._patrolLocation = null
        this._loopDone = false
        this._index = -1
    }

    getSalience(context) {
        return this._agent._current_job._name === "Patrolman"
        && this._agent._current_job.onTheJob(this._agent._bot.time.timeOfDay) ? 5 : Number.NEGATIVE_INFINITY;
    }

    setup(context) {
        this._patrolLocation = this._agent._current_job._location
    }

    start() {
        super.start();
        this._bot.equip(mcData.itemsByName["diamond_sword"], "hand").then()
        this._bot.equip(mcData.itemsByName["diamond_helmet"], "head").then()
        this._bot.equip(mcData.itemsByName["diamond_chestplate"], "torso").then()
        this._bot.equip(mcData.itemsByName["diamond_leggings"], "legs").then()
        this._bot.equip(mcData.itemsByName["diamond_boots"], "feet").then()
        let listOfPoints = this._patrolLocation.getClockwiseVertices()
        this._index = 0
        this._nextPatrolPoint = listOfPoints[this._index]
        this._bot.pathfinder.setGoal(new GoalNearXZ(listOfPoints[this._index].x, listOfPoints[this._index].z, 1))
    }

    update() {
        super.update();
        let listOfPoints = this._patrolLocation.getClockwiseVertices()
        if (this._bot.entity.position.distanceSquared(this._nextPatrolPoint) <= 7.5) {
            this._index++
            if (this._index === 4) {
                this._loopDone = true
            } else {
                this._nextPatrolPoint = listOfPoints[this._index]
                this._bot.pathfinder.setGoal(new GoalNearXZ(listOfPoints[this._index].x, listOfPoints[this._index].z, 1))
            }
        }
    }

    isPossible() {
        return this._patrolLocation
    }

    hasEnded() {
        return super.hasEnded() || this._loopDone
    }

    exit() {
        super.exit();
        this._bot.unequip("hand").then()
        this._bot.unequip("head").then()
        this._bot.unequip("torso").then()
        this._bot.unequip("legs").then()
        this._bot.unequip("feet").then()
        this._loopDone = false;
        this._patrolLocation = null
        this._bot.pathfinder.setGoal(null)
    }
}

module.exports = {Patrol}