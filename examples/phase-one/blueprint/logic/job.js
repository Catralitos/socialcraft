class Job{

    constructor(affinity, name, timeBlocks, location) {
        this._affinity = affinity;
        this._name = name;
        this._location = location
        this._timeBlocks = timeBlocks;
    }

    onTheJob(currentTime){
        let timeOfDay = (currentTime + 6000) % 24000
        for (let i = 0; i < this._timeBlocks.length; i++){
            let block = this._timeBlocks[i]
            if (timeOfDay >= block._startTime && timeOfDay < block._endTime){
                return true;
            }
        }
        return false
    }

    getAvailablePractices(currentTime){
        let timeOfDay = (currentTime + 6000) % 24000
        for (let i = 0; i < this._timeBlocks.length; i++){
            let block = this._timeBlocks[i]
            if (timeOfDay >= block._startTime && timeOfDay < block._endTime){
                return block._practices;
            }
        }
        return []
    }
}

module.exports = {Job}
