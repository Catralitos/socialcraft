const Identity = require("../../../identity.js");

class Enemy extends Identity {
    
    constructor(bot) {
        super(bot, "Enemy");
        this._salienceRules = {
            "Goodbye": 1.5,
            "Insult": 1.75,
            "Compliment": 0.1,
            "Greet": 0.5,
            "AvoidPeople": 1.2
        }
    }

    isValid(agent, context) {
        if (!context._listOfSurroundingPeople.length > 0) return false
        return this.getSurroundingEnemies(agent, context).length >= context._listOfSurroundingPeople.length / 2;
    }

    getSurroundingEnemies(agent, context) {
        let aux = []
        for (let i = 0; i < context._listOfSurroundingPeople.length; i++) {
            if (agent._friendships[context._listOfSurroundingPeople[i].username] < 5) {
                aux.push(context._listOfSurroundingPeople[i])
            }
        }
        return aux
    }
}

module.exports = {Enemy}