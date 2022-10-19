const Practice = require("./practice");
const {GoalNear} = require('mineflayer-pathfinder').goals
const pathfinder = require('mineflayer-pathfinder').pathfinder

class SocialPractice extends Practice {

    //this bool represents if the bot already said a message, whether first or as a reply
    _chatted;
    //this bool represents if the bot needs/has decided to reply
    _mustReply;
    //this bool represents if the bot is done with the interaction, for hasEnded
    //there are three cases where they are done
    //1. they got an answer to their message
    //2. they got the message, and decided to reply (and they did)
    //3. they got the message, and decided not to reply
    //they are also done if they don't get an answer to that message, but that's where the timeout comes into play
    _done;
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

    accepts(username) {
        throw new Error("Method 'accepts()' must be implemented.");
    }

    setup(context) {
        super.setup(context);
        if (this._agent._socializing && this._agent._socialPartner) {
            this._currentTarget = this._agent._socialPartner
        }
    }

    start() {
        super.start();
    }

    update() {
        super.update();
        if (!this._currentTarget || !this._currentTarget.entity || !this._currentTarget.entity.position) return
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

    hasEnded() {
        return super.hasEnded() || this._done
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