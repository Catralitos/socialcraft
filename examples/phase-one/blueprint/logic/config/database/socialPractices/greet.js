const SocialPractice = require("../../../socialPractice.js")
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class Greet extends SocialPractice {

    constructor(bot, agent, timeout = 20) {
        super(bot, "Greet", agent, timeout);
        this._bot.on("chat", (username, message) => {
            if (message === 'Hello, ' + this._bot.username) {
                if (this.accepts(username) && !this._agent._socializing) {
                    this._agent._socializing = true;

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

                    //if I haven't said hello, I must reply
                    if (!this._chatted) {
                        this._mustReply = true
                    }
                    //if I have said hello, then I got a reply, and I'm done
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
                //if I'm replying, after throwing the message, I am done
                if (this._mustReply) {
                    this._done = true
                }
                this._bot.chat("Hello, " + this._agent._socialPartner.username)
                this._chatted = true

            }
        }
    }

}

module.exports = {Greet}