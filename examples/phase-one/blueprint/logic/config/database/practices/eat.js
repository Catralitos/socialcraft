const Practice = require("../../../practice.js")
const minecraftData = require('minecraft-data')
const mcData = minecraftData('1.12')

class Eat extends Practice {

    _eaten;

    constructor(bot, agent, timeout = 20) {
        super(bot, "Eat", agent, timeout);
        this._eaten = false;
    }

    getSalience(context) {
        let village = Number.parseInt(this._agent._bed[3]) < 5
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
        super.setup(context)
    }

    start() {
        super.start()
        let foodToEquip = mcData.foodsByName['baked_potato']
        if (foodToEquip) {
            this._bot.equip(mcData.foodsByName['baked_potato'], "off-hand").then(r => r)
            if (this._bot.heldItem !== null) {
                let currentTimeOfDay = (this._bot.time.timeOfDay + 6000) % 24000
                let mealTime1 = (currentTimeOfDay >= 8000 && currentTimeOfDay < 9000)
                let mealTime2 = (currentTimeOfDay >= 13000 && currentTimeOfDay < 14000)
                let mealTime3 = (currentTimeOfDay >= 17000 && currentTimeOfDay < 18000)
                if (mealTime1) {
                    this._bot.chat("I am eating breakfast.")
                } else if (mealTime2) {
                    this._bot.chat("I am eating lunch.")
                } else if (mealTime3) {
                    this._bot.chat("I am eating dinner.")
                }
                if (this._bot.food < 20) {
                    this._bot.consume().then()
                }
                this._eaten = true
            }
        }
    }

    update() {
        super.update()
    }

    isPossible() {
        let currentTimeOfDay = (this._bot.time.timeOfDay + 6000) % 24000
        return (currentTimeOfDay >= 0 && currentTimeOfDay < 9000) || (currentTimeOfDay >= 13000 && currentTimeOfDay < 14000)
            || (currentTimeOfDay >= 17000 && currentTimeOfDay < 18000)
    }

    hasEnded() {
        return super.hasEnded() || this._eaten
    }

    exit() {
        super.exit()
        this._bot.deactivateItem();
    }

}

module.exports = {Eat};