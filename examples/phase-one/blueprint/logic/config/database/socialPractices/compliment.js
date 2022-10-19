const SocialPractice = require("../../../socialPractice.js")
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class Compliment extends SocialPractice {

    constructor(bot, agent, timeout = 20) {
        super(bot, "Compliment", agent, timeout);
        this._bot.on("chat", (username, message) => {
            if (message === 'I think you are amazing ' + this._bot.username + "!") {
                if (this._agent._socializing && this._agent._socialPartner && this._agent._socialPartner.username === username && this.accepts(username)) {
                    this._mustReply = true
                }
            } else if (message === 'Thank you so much ' + this._bot.username + "!") {
                if (this._agent._socializing && this._agent._socialPartner && this._agent._socialPartner.username === username && this.accepts(username)) {
                    this._done = true
                }
            }
        })
    }

    accepts(username) {
        let accepted = this._agent._personality_traits["Agreeableness"] * this._agent._friendships[username] > 5
        if (accepted) {
            this._agent._friendships[username] = clamp(this._agent._friendships[username] + 0.3, 0, 10)
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
                return this._agent._personality_traits["Agreeableness"] * this._agent._friendships[this._agent._socialPartner.username]
            }
        }
    }

    update() {
        super.update()
        if (this._nearTarget) {
            if (!this._chatted) {
                if (this._mustReply) {
                    this._bot.chat('Thank you so much ' + this._agent._socialPartner.username + "!")
                    this._done = true
                } else {
                    this._bot.chat('I think you are amazing ' + this._agent._socialPartner.username + "!")
                }
                this._chatted = true
            }
        }
    }

}

module.exports = {Compliment}