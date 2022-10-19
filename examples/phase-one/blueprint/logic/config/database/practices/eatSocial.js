const Practice = require("../../../practice.js")
const minecraftData = require('minecraft-data')
const mcData = minecraftData('1.12')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const {GoalNear} = require("mineflayer-pathfinder").goals

class EatSocial extends Practice {

    _eaten;
    _socialGatheringPlace;

    constructor(bot, agent, timeout = 20) {
        super(bot, "EatSocial", agent, timeout);
        this._eaten = false;
    }

    getSalience(context) {
        let village = Number.parseInt(this._agent._bed[3]) > 4
        if (!village) {
            return Number.NEGATIVE_INFINITY
        }
        let currentTimeOfDay = (this._bot.time.timeOfDay + 6000) % 24000
        let mealTime = (currentTimeOfDay >= 8000 && currentTimeOfDay < 9000) ||
            (currentTimeOfDay >= 13000 && currentTimeOfDay < 14000)
            || (currentTimeOfDay >= 17000 && currentTimeOfDay < 18000)
        if (!mealTime) {
            this._eaten = false
            return Number.NEGATIVE_INFINITY
        } else {
            return !this._eaten ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
        }
    }

    setup(context) {
        this._socialGatheringPlace = context._database.getLocationByName("Canteen")
    }

    start() {
        super.start()
        let centralPoint = this._socialGatheringPlace.getCentralPointFlat()
        let goal = new GoalNear(centralPoint.x, centralPoint.y, centralPoint.z, 1)
        this._bot.pathfinder.setGoal(goal)
    }

    update() {
        if (this._socialGatheringPlace.isInLocation(this._bot.entity.position)) {
            this.eat()
        }
    }

    eat() {
        let foodToEquip = mcData.foodsByName['baked_potato']
        if (foodToEquip) {
            this._bot.equip(mcData.foodsByName['baked_potato'], "off-hand").then(r => r)
            if (this._bot.heldItem !== null) {
                let currentTimeOfDay = (this._bot.time.timeOfDay + 6000) % 24000
                let mealTime1 = (currentTimeOfDay >= 8000 && currentTimeOfDay < 9000)
                let mealTime2 = (currentTimeOfDay >= 13000 && currentTimeOfDay < 14000)
                let mealTime3 = (currentTimeOfDay >= 17000 && currentTimeOfDay < 18000)
                if (mealTime1) {
                    this._bot.chat("I am eating breakfast!")
                } else if (mealTime2){
                    this._bot.chat("I am eating lunch!")
                } else if (mealTime3){
                    this._bot.chat("I am eating dinner!")
                }
                if (this._bot.food < 20) {
                    this._bot.consume().then()
                }
                this._eaten = true
            }
        }
    }

    isPossible() {
        let currentTimeOfDay = (this._bot.time.timeOfDay + 6000) % 24000
        return this._socialGatheringPlace && ((currentTimeOfDay >= 0 && currentTimeOfDay < 9000) || (currentTimeOfDay >= 13000 && currentTimeOfDay < 14000)
            || (currentTimeOfDay >= 17000 && currentTimeOfDay < 18000))
    }

    hasEnded() {
        return super.hasEnded() || this._eaten
    }

    exit() {
        super.exit()
        this._bot.deactivateItem();
        this._bot.pathfinder.setGoal(null);

    }

}

module.exports = {EatSocial};