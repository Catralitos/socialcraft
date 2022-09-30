class TimeBlock{

    constructor(startTime, endTime, practices) {
        this._startTime = startTime * 1000
        this._endTime = endTime * 1000
        this._practices = practices;
    }
}
module.exports = TimeBlock