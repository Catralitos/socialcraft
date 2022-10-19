class Agent {

    _bot;
    _name;
    _job_infos;
    _knowledge_base;
    _personality_traits;
    _relationships;
    _friendships;
    _loves;
    _bed;
    _current_identities;
    _current_job;
    _socializing;
    _socialPartner;

    constructor(bot, handler) {
        this._bot = bot;
        this._name = handler.get_init_env_variable("name")
        this._job_infos = handler.get_init_env_variable("job_infos")
        this._knowledge_base = handler.get_init_env_variable("knowledge_base")
        this._personality_traits = handler.get_init_env_variable("personality_traits")
        this._relationships = handler.get_init_env_variable("relationships")
        this._friendships = handler.get_init_env_variable("friendships")
        this._loves = handler.get_init_env_variable("loves")
        this._bed = handler.get_init_env_variable("bed")
        this._current_identities = []
        this._current_job = null
        this._socializing = false;
        this._socialPartner = null;
    }

    getItemInKnowledgeBase(key) {
        return this._knowledge_base[key]
    }

    updateItemInKnowledgeBase(key, newValue) {
        this._knowledge_base[key] = newValue;
    }

    incrementItemInKnowledgeBase(key) {
        this._knowledge_base[key] = this._knowledge_base[key] + 1;
    }

    setValidIdentities(context, identityList) {
        this._current_identities = []
        for (let i = 0; i < identityList.length; i++) {
            if (identityList[i].isValid(this, context)) {
                this._current_identities.push(identityList[i])
            }
        }
    }

    updateJob(jobList) {
        let highestSalience = -1
        let mostSalientJob = null
        for (let i = 0; i < jobList.length; i++) {
            let currentJob = jobList[i]
            let currentSalience = currentJob._affinity
            if (currentSalience >= highestSalience) {
                highestSalience = currentSalience
                mostSalientJob = currentJob
            }
        }
        this._current_job = mostSalientJob
    }

    getMostSalientPractice(context, availablePractices) {
        let highestSalience = -1
        let mostSalientPractice = null
        for (let i = 0; i < availablePractices.length; i++) {
            let currentPractice = availablePractices[i]
            let currentSalience = currentPractice.getSalience(context)
            for (let j = 0; j < this._current_identities.length; j++) {
                let multiplier = this._current_identities[j]._salienceRules[currentPractice._name]
                if (multiplier !== null && multiplier !== undefined && !Number.isNaN(multiplier)){
                    currentSalience *= multiplier
                }
            }
            console.log("     " + currentPractice._name + " with salience " + currentSalience)
            if (currentSalience >= highestSalience) {
                highestSalience = currentSalience
                mostSalientPractice = currentPractice
            }
        }
        return mostSalientPractice
    }
}

module.exports = Agent