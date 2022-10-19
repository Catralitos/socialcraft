class Context{

    _location;
    _listOfSurroundingPeople;
    _weather;
    _isWorking;
    _database;

    constructor(database, agent) {
        this._database = database
        this._location = database.getBotLocation()
        this._listOfSurroundingPeople = database.getBotsInLocation(this._location)
        this._weather = agent._bot.rainState + agent._bot.thunderState
        this._isWorking = agent._current_job.onTheJob(agent._bot.time.timeOfDay)
    }

}
module.exports = Context