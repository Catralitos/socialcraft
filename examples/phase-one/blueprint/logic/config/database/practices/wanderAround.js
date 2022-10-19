const pathfinder = require('mineflayer-pathfinder').pathfinder
const {GoalNear} = require('mineflayer-pathfinder').goals
const Practice = require("../../../practice.js")
const {Vec3} = require("vec3");

class WanderAround extends Practice {

    _targetPosition;
    _done;

    constructor(bot, agent, timeout = 20) {
        super(bot, "WanderAround", agent, timeout);
        this._targetPosition = null;
    }

    getSalience(context) {
        return (1 - this._agent._personality_traits["Agreeableness"]) + 0.5
    }

    setup(context) {
        this._targetPosition = new Vec3(this._bot.entity.position.x, this._bot.entity.position.y, this._bot.entity.position.z).add(
            new Vec3(getRandomFloat(-5, 5), 0, getRandomFloat(-5, 5))
        )

        function getRandomFloat(min, max) {
            const str = (Math.random() * (max - min) + min);

            return parseFloat(str);
        }
    }

    start() {
        super.start()
        let goal = new GoalNear(this._targetPosition.x, this._targetPosition.y, this._targetPosition.z, 0.5)
        this._bot.pathfinder.setGoal(goal)
    }

    update() {
        if (this._targetPosition.distanceTo(this._bot.entity.position) <= 1){
             this._done = true;
        }
    }

    isPossible() {
        return true
    }

    hasEnded() {
        return super.hasEnded() || this._done
    }

    exit() {
        super.exit();
        this._done = false
    }
}

module.exports = {WanderAround};
