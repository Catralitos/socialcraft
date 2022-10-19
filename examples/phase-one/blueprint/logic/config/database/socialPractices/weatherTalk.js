const SocialPractice = require("../../../socialPractice.js")
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class WeatherTalk extends SocialPractice {

    constructor(bot, agent, timeout = 20) {
        super(bot, "WeatherTalk", agent, timeout);
        this._bot.on("chat", (username, message) => {
            if (message === 'The weather is nice today, right ' + this._bot.username + "?") {
                if (this._agent._socializing && this._agent._socialPartner && this._agent._socialPartner.username === username && this.accepts(username)) {
                    this._mustReply = true
                }
            } else if (message === 'Yeah! No rain, ' + this._bot.username + ".") {
                if (this._agent._socializing && this._agent._socialPartner && this._agent._socialPartner.username === username && this.accepts(username)) {
                    this._done = true
                }
            }
        })
    }

    accepts(username) {
        let accepted = ((this._agent._personality_traits["Agreeableness"] * this._agent._friendships[username]) +
            (1 - this._bot.rainState)) > 2
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
            if (this._mustReply) {
                return Number.POSITIVE_INFINITY
            } else {
                return this._agent._personality_traits["Agreeableness"] * (this._agent._friendships[this._agent._socialPartner.username]) +
                    (1 - this._bot.rainState)
            }
        }
    }

    update() {
        super.update()
        if (this._nearTarget) {
            if (!this._chatted) {
                if (this._mustReply) {
                    this._bot.chat('Yeah! No rain, ' + this._agent._socialPartner.username + ".")
                    this._done = true
                } else {
                    this._bot.chat('The weather is nice today, right ' + this._agent._socialPartner.username + "?")
                }
                this._chatted = true
            }
        }
    }

}

module.exports = {WeatherTalk}