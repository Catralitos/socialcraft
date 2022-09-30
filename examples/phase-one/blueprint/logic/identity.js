class Identity {

    _name;
    _bot;
    _salienceRules;

    constructor(bot, name) {
        if (this.constructor === Identity) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this._name = name
        this._bot = bot
        this._salienceRules = {}
    }


    isValid(agent, context) {
        throw new Error("Method 'getSalience()' must be implemented.");
    }

}

module.exports = Identity;