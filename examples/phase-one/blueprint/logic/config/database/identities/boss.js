const Identity = require("../../../identity.js");

class Boss extends Identity {


    constructor(bot) {
        super(bot, "Boss");
        this._salienceRules = {
            "Greet": 0.25
        }
    }

    isValid(agent, context) {
        return true;
    }
}

module.exports = {Boss}