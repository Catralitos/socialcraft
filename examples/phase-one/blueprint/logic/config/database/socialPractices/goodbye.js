const SocialPractice = require("../../../socialPractice.js")
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class Goodbye extends SocialPractice {

    constructor(bot, agent, timeout = 20) {
        super(bot, "Goodbye", agent, timeout);
        this._done = false;
        this._bot.on("chat", (username, message) => {
            if (message === 'Goodbye, ' + this._bot.username) {
                if (this.accepts(username) && this._agent._socializing) {
                    //if I haven't said goodbye, I must reply
                    if (!this._chatted) {
                        this._mustReply = true
                    }
                    //if I have said goodbye, then I got a reply, and I'm done
                    else {
                        this._done = true
                    }
                }
            }
        })
    }

    accepts(username) {
        let accepted = (this._agent._personality_traits["Agreeableness"] * this._agent._friendships[username]) > 2
        if (accepted) {
            this._agent._friendships[username] = clamp(this._agent._friendships[username] + 0.2, 0, 10)
        } else {
            this._agent._friendships[username] = clamp(this._agent._friendships[username] - 0.2, 0, 10)
            this._done = true
        }
        return accepted
    }

    getSalience(context) {
        if (!this._agent._socializing || !this._agent._socialPartner) {
            return Number.NEGATIVE_INFINITY
        } else {
            //TODO trocar o 2 para ser algo mais a haver com a decisão
            return this._mustReply ? Number.POSITIVE_INFINITY : 2
        }
    }

    update() {
        super.update()
        if (this._nearTarget) {
            if (!this._chatted) {
                //if I'm replying, after throwing the message, I am done
                if (this._mustReply) {
                    this._done = true
                }
                this._bot.chat("Goodbye, " + this._agent._socialPartner.username)
                this._chatted = true
            }
        }
    }

    exit() {
        super.exit();
        this._agent._socializing = false;
        this._agent._socialPartner = null;
    }
}

module.exports = {Goodbye}