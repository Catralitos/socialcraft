const Identity = require("../../../identity.js");

class Friend extends Identity {

    constructor(bot) {
        super(bot, "Friend");
        this._salienceRules = {
            "Greet": 1.2,
            "Compliment": 1.75,
            "Insult": 0.1,
            "Goodbye": 0.9,
            "AvoidPeople": 0.3
        }
    }

    isValid(agent, context) {
        if (!context._listOfSurroundingPeople.length > 0) return false
        return this.getSurroundingFriends(agent, context).length >= context._listOfSurroundingPeople.length / 2;
    }

    getSurroundingFriends(agent, context) {
        let aux = []
        for (let i = 0; i < context._listOfSurroundingPeople.length; i++) {
            if (agent._friendships[context._listOfSurroundingPeople[i].username] >= 5) {
                aux.push(context._listOfSurroundingPeople[i])
            }
        }
        return aux
    }
}

module.exports = {Friend}