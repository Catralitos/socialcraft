const Practice = require("../../../practice.js")
const mcData = require('minecraft-data')

class Eat extends Practice {

    _targetFoodItem;
    _ended;

    constructor(bot, agent, timeout = 20) {
        super(bot, "Eat", agent, timeout);
        this._targetFoodItem = null;
        this._ended = false;
    }

    getSalience(context) {
        return 1 - (this._bot.food / 20)
        /*let hunger = agent.getItemInKnowledgeBase("hunger")
        let hungerThreshold = agent.getItemInKnowledgeBase("hungerThreshold")
        return Math.max(0, (hunger - hungerThreshold) / hunger)*/
    }

    setup(context) {
        let availableFood = this._bot.inventory.items().filter(item => mcData.foodsByFoodPoints.contains(item));
        if (availableFood.length > 0) {
            this._targetFoodItem = availableFood[0]
        }
    }

    start() {
        super.start()
        this._bot.chat("I am going to eat")
        this._bot.equip(this._targetFoodItem, "hand").then(r => r)
        this._bot.consume().then(
            r => this._ended = true
        )
    }

    update() {
        //do nothing
    }

    isPossible() {
        return this._targetFoodItem !== null;
    }

    hasEnded() {
        return super.hasEnded() || this._ended
    }

    exit() {
        super.exit()
        this._bot.deactivateItem();
        this._targetFoodItem = null;
        this._ended = false;
    }

}

module.exports = {Eat};