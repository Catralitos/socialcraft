const SocialPractice = require("../../../socialPractice.js")

class Greet extends SocialPractice {

    constructor(bot, agent, timeout = 20) {
        super(bot, "Greet", agent, timeout);
        this._bot.on("chat", (username, message) => {
            if (message === 'Hello, ' + this._bot.username) {
                if (this.accepts(username) && !this._agent._socializing) {
                    this._agent._socializing = true;
                    if (!this._chatted) {
                        this._mustReply = true
                    }

                    function getBotByUsername(username, bot) {
                        let players = Object.values(bot.players);
                        for (let i = 0; i < players.length; i++) {
                            let botAux = players[i]
                            if (botAux.username === username && botAux.entity != null) {
                                return botAux
                            }
                        }
                        return null
                    }

                    this._currentTarget = getBotByUsername(username, this._bot)
                } else {
                    this._done = true
                }
            }
        })
    }

    accepts(username) {
        return this._agent._personality_traits["Agreeableness"] * this._agent._friendships[username] > 0
    }

    getSalience(context) {
        //if it accepted, then it must reply thus a high salience
        if (this._agent._socializing) {
            return this._mustReply ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
        } else {
            //else see if there is someone around you want to greet
            let highestSalience = -1;

            for (let i = 0; i < context._listOfSurroundingPeople.length; i++) {
                let otherBot = context._listOfSurroundingPeople[i]
                let currentSalience = this._agent._personality_traits["Agreeableness"] * (this._agent._friendships[otherBot.username])
                if (currentSalience > highestSalience) {
                    highestSalience = currentSalience
                    this._currentTarget = otherBot
                }
            }
            return highestSalience;
        }
    }

    setup(context) {
        super.setup()
        //current target is attained in the chat event or the salience function
        //thus setting the social partner needs to happen after both
        this._agent._socialPartner = this._currentTarget
    }

    update() {
        super.update()
        if (this._nearTarget) {
            if (!this._chatted) {
                this._bot.chat("Hello, " + this._agent._socialPartner.username)
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

}

module.exports = {Greet}