const SocialPractice = require("../../../socialPractice.js")

class Goodbye extends SocialPractice {

    constructor(bot, agent, timeout = 20) {
        super(bot, "Goodbye", agent, timeout);
        this._done = false;
        this._bot.on("chat", (username, message) => {
            if (message === 'Goodbye, ' + this._bot.username) {
                if (this.accepts(username) && this._agent._socializing) {
                    if (!this._chatted) {
                        this._mustReply = true;
                    }
                } else {
                    this._done = true;
                }
            }
        })
    }

    accepts(otherAgent) {
        return true;
    }

    getSalience(context) {
        if (!this._agent._socializing) {
            return Number.NEGATIVE_INFINITY
        } else {
            //TODO trocar o 0.5 para ser algo mais a haver com a decisão
            return this._mustReply ? Number.POSITIVE_INFINITY : 0.5
        }
    }

    update() {
        super.update()
        if (this._nearTarget) {
            if (!this._chatted) {
                this._bot.chat("Goodbye, " + this._agent._socialPartner.username)
                this._chatted = true
            }
            if (this._agent._socializing) {
                this._done = true
            }
        }
    }

    hasEnded() {
        return super.hasEnded() || this._done;
    }

    exit() {
        super.exit();
        this._agent._socializing = false;
        this._agent._socialPartner = null;
    }
}

module.exports = {Goodbye}