const SocialPractice = require("../../../socialPractice.js")
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class Insult extends SocialPractice {

    constructor(bot, agent, timeout = 20) {
        super(bot, "Insult", agent, timeout);
        this._bot.on("chat", (username, message) => {
            if (message === 'I think you suck ' + this._bot.username + "!") {
                if (this._agent._socializing && this._agent._socialPartner && this._agent._socialPartner.username === username && this.accepts(username)) {
                    this._mustReply = true
                }
            } else if (message === 'Well, ' + this._bot.username + ', I think you suck too.') {
                if (this._agent._socializing && this._agent._socialPartner && this._agent._socialPartner.username === username && this.accepts(username)) {
                    this._done = true
                }
            }
        })
    }

    accepts(username) {
        let accepted = (1 - this._agent._personality_traits["Agreeableness"]) * (10 - this._agent._friendships[username]) > 5
        if (accepted) {
            this._agent._friendships[username] = clamp(this._agent._friendships[username] - 0.5, 0, 10)
        } else {
            this._agent._friendships[username] = clamp(this._agent._friendships[username] - 0.3, 0, 10)
            this._done = true
        }
        return accepted
    }

    getSalience(context) {
        if (!this._agent._socializing || !this._agent._socialPartner) {
            return Number.NEGATIVE_INFINITY
        } else {
            if (this._mustReply) {
                return Number.POSITIVE_INFINITY
            } else {
                return (1 - this._agent._personality_traits["Agreeableness"]) * (10 - this._agent._friendships[this._agent._socialPartner.username])
            }
        }
    }

    update() {
        if (this._nearTarget) {
            if (!this._chatted) {
                if (this._mustReply) {
                    this._bot.chat('Well ' + this._agent._socialPartner.username + ", I think you suck too.")
                    this._done = true
                } else {
                    this._bot.chat('I think you suck ' + this._agent._socialPartner.username + "!")
                }
                this._chatted = true
            }
        }
    }

}

module.exports = {Insult}