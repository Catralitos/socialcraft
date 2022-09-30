const Practice = require("./practice");
const {GoalNear} = require('mineflayer-pathfinder').goals
const pathfinder = require('mineflayer-pathfinder').pathfinder

class SocialPractice extends Practice {

    _chatted;
    _done;
    _mustReply;
    _currentTarget;
    _nearTarget;

    constructor(bot, name, agent, timeout = 20) {
        super(bot, name, agent, timeout)
        if (this.constructor === SocialPractice) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this._startTime = null
        this._chatted = false;
        this._done = false;
        this._mustReply = false;
        this._nearTarget = false;
        this._currentTarget = null;
    }

    accepts(otherAgent) {
        throw new Error("Method 'accepts()' must be implemented.");
    }

    setup(context) {
        super.setup(context);
        if (this._agent._socializing && this._agent._socialPartner !== null) {
            this._currentTarget = this._agent._socialPartner
        }
    }

    update() {
        super.update();
        let goal = new GoalNear(this._currentTarget.entity.position.x, this._currentTarget.entity.position.y, this._currentTarget.entity.position.z, 2)
        this._bot.pathfinder.setGoal(goal)
        let distance = this._bot.entity.position.distanceTo(this._currentTarget.entity.position)
        if (distance <= 3) {
            this._nearTarget = true
        }

    }

    isPossible() {
        let socialBool
        if (this._agent._socializing){
            socialBool = this._agent._socialPartner !== null
        } else {
            socialBool = true
        }
        return this._currentTarget !== null && socialBool;
    }

    exit() {
        super.exit()
        this._chatted = false;
        this._done = false;
        this._mustReply = false;
        this._nearTarget = false;
        this._currentTarget = null
        this._bot.pathfinder.setGoal(null);
    }
}

module.exports = SocialPractice;