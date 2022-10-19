const Identity = require("../../../identity.js");

class Working extends Identity {
    
    constructor(bot) {
        super(bot, "Working");
        this._salienceRules = {
            "Goodbye": 2,
            "Insult": 0,
            "Compliment": 0,
            "Greet": 0.5,
            "AvoidPeople": 0,
            "WeatherTalk": 0
        }
    }

    isValid(agent, context) {
        return context._isWorking
    }
}

module.exports = {Working}