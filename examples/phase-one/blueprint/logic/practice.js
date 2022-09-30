class Practice {

    _startTime;
    _bot;
    _timeout
    _name;
    _agent;

    constructor(bot, name, agent, timeout = 20) {
        if (this.constructor === Practice) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this._startTime = 0
        this._bot = bot
        this._timeout = timeout
        this._name = name;
        this._agent = agent;
    }

    getSalience(context) {
        return 0
    }

    isPossible() {
        return false
    }

    hasEnded() {
        return this._startTime !== 0 ? (Date.now() - this._startTime) > (this._timeout * 1000) || !this.isPossible(): !this.isPossible();
    }

    setup(context) {
        //pass
    }

    start() {
        this._startTime = Date.now()
    }

    update() {
        //pass
    }

    exit() {
        this._startTime = 0;
    }

}

module.exports = Practice;
