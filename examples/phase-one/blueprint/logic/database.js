const {Vec3} = require("vec3");

const House = require("./house.js")
const SocialPlace = require("./socialPlace.js")

//Importing all the practices
const {AvoidPeople} = require('./config/database/practices/avoidPeople.js')
const {ChopWood} = require('./config/database/practices/chopWood.js')
const {MineRock} = require('./config/database/practices/mineRock.js')
const {Eat} = require('./config/database/practices/eat.js')
const {GoToHouse} = require('./config/database/practices/goToHouse.js')
const {Sleep} = require('./config/database/practices/sleep.js')
const {WanderAround} = require('./config/database/practices/wanderAround.js')
const {Greet} = require('./config/database/socialPractices/greet.js')
const {Goodbye} = require('./config/database/socialPractices/goodbye.js')
const JOB_DEFINITIONS = require("./config/database/jobDefinitions");
const {Job} = require("./job");
const TimeBlock = require("./timeBlock");
const {Boss} = require("./config/database/identities/boss");

class Database {

    bot;
    handler;
    agent;
    _jobs;
    _practices;
    _identities;
    _houses;
    _socialPlaces;
    _combinedLocations;

    constructor(bot, handler, agent) {
        this.bot = bot;
        this.handler = handler;
        this.agent = agent;
        this._jobs = [];
        this._practices = [];
        this._houses = [];
        this._socialPlaces = []
        this._identities = []
    }

    addHouses() {
        let houseData = this.handler.get_init_env_variable("houses")
        let houseAux = []
        for (let i = 0; i < houseData.length; i++) {
            let h = houseData[i]
            houseAux.push(new House(h.name, new Vec3(h.bounding_box.vertex1[0], h.bounding_box.vertex1[1], h.bounding_box.vertex1[2]),
                new Vec3(h.bounding_box.vertex2[0], h.bounding_box.vertex2[1], h.bounding_box.vertex2[2]), h.bounding_box.height, h.beds))
        }
        houseAux.sort(function (a, b) {
            return a.getVolume() - b.getVolume();
        })
        this._houses = houseAux
        let bed = this.getBed(this.agent._bed)
        this.agent.updateItemInKnowledgeBase("bed_position", new Vec3(bed.position[0], bed.position[1], bed.position[2]))
    }

    addSocialPlaces() {
        let socialPlaceData = this.handler.get_init_env_variable("social_places")
        let socialAux = []
        for (let i = 0; i < socialPlaceData.length; i++) {
            let s = socialPlaceData[i]
            socialAux.push(new SocialPlace(s.name, new Vec3(s.bounding_box.vertex1[0], s.bounding_box.vertex1[1], s.bounding_box.vertex1[2]),
                new Vec3(s.bounding_box.vertex2[0], s.bounding_box.vertex2[1], s.bounding_box.vertex2[2]), s.bounding_box.height, s.social_appropriateness))
        }
        socialAux.sort(function (a, b) {
            return a.getVolume() - b.getVolume();
        })
        this._socialPlaces = socialAux
    }

    mergeLocationsList() {
        let auxList = this._houses.concat(this._socialPlaces)
        auxList.sort(function (a, b) {
            return a.getVolume() - b.getVolume();
        })
        this._combinedLocations = auxList
    }

    addPractices() {
        this._practices.push(new AvoidPeople(this.bot, this.agent))
        this._practices.push(new ChopWood(this.bot, this.agent));
        this._practices.push(new Eat(this.bot, this.agent));
        this._practices.push(new GoToHouse(this.bot, this.agent))
        this._practices.push(new MineRock(this.bot, this.agent));
        this._practices.push(new Sleep(this.bot, this.agent));
        this._practices.push(new WanderAround(this.bot, this.agent))
        this._practices.push(new Greet(this.bot, this.agent))
        this._practices.push(new Goodbye(this.bot, this.agent))
    }

    addJobs() {
        let agent_jobs = []
        //for each job
        for (let i = 0; i < JOB_DEFINITIONS.length; i++) {
            let job = JOB_DEFINITIONS[i];
            let timeBlocksInfo = job.TimeBlocks;
            let timeBlocks = []
            //for each time block in the job
            for (let j = 0; j < timeBlocksInfo.length; j++) {
                let blockInfo = timeBlocksInfo[j]
                let practices = []
                //for each practice in the time block
                for (let k = 0; k < blockInfo.Practices.length; k++) {
                    practices.push(this.getPracticeByName(blockInfo.Practices[k]))
                }
                timeBlocks.push(new TimeBlock(blockInfo.StartTime, blockInfo.EndTime, practices))
            }
            agent_jobs.push(new Job(this.handler.get_init_env_variable("jobs")[job.Name], job.Name, timeBlocks));
        }
        this._jobs = agent_jobs
    }

    addIdentities(){
        this._identities.push(new Boss(this.bot))
    }

    getPracticeByName(practiceName) {
        for (let i = 0; i < this._practices.length; i++) {
            if (this._practices[i]._name === practiceName) {
                return this._practices[i]
            }
        }
        return null
    }

    getShuffledPractices() {
        return this._practices.map((x) => x).sort(() => Math.random() - 0.5);
    }

    getAvailablePractices() {
        let currentTime = this.bot.time.timeOfDay
        if (this.agent._current_job != null && this.agent._current_job.onTheJob(currentTime)) {
            return this.agent._current_job.getAvailablePractices(currentTime)
        } else {
            return this.getShuffledPractices()
            //.filter(practice => {
            /*if (practice instanceof SocialPractice) {
                if (!this.agent._socializing) {
                    return practice._startsSocial;
                } else {
                    if (practice._startsSocial) {
                        return false;
                    }
                }
            } else {
                return true;
            }*/
            //})
        }
    }

    getBotLocation(bot = this.bot) {
        let position = bot.entity.position
        for (let i = 0; i < this._combinedLocations.length; i++) {
            if (this._combinedLocations[i].isInLocation(position)) {
                return this._combinedLocations[i]
            }
        }
        return null
    }

    getBotsInLocation(location) {
        let listOfBots = []
        let players = Object.values(this.bot.players);
        for (let i = 0; i < players.length; i++) {
            let botAux = players[i]
            if (botAux.username !== this.bot.username && botAux.entity != null) {
                if (this.getBotLocation(botAux) === location) {
                    listOfBots.push(botAux)
                }
            }
        }
        return listOfBots
    }

    getBotByUsername(username){
        let players = Object.values(this.bot.players);
        for (let i = 0; i < players.length; i++) {
            let botAux = players[i]
            if (botAux.username === username && botAux.entity != null) {
                return botAux
            }
        }
        return null
    }

    getAllBeds() {
        let beds = []
        for (let i = 0; i < this._houses.length; i++) {
            for (let j = 0; j < this._houses[i]._beds.length; j++) {
                beds.push(this._houses[i]._beds[j])
            }
        }
    }

    getBed(bedName) {
        for (let i = 0; i < this._houses.length; i++) {
            for (let j = 0; j < this._houses[i]._beds.length; j++) {
                if (this._houses[i]._beds[j].name === bedName) {
                    return this._houses[i]._beds[j]
                }
            }
        }
    }

    printAll() {
        console.log("!!!" + this._houses.length + " Houses!!!")
        this.printHouses()
        console.log("!!!" + this._socialPlaces.length + " Social Places!!!")
        this.printSocialPlaces()
        console.log("!!!" + this._practices.length + " Practices!!!")
        this._practices.forEach(this.printPractice)
        console.log("!!!" + this._jobs.length + " Jobs!!!")
        this._jobs.forEach(this.printJob)
    }

    printPractice(practice) {
        console.log(practice._name)
    }

    printJob(job) {
        console.log(job._name + " with affinity " + job._affinity);
    }

    printHouses() {
        for (let i = 0; i < this._houses.length; i++) {
            this._houses[i].print()
        }
    }

    printSocialPlaces() {
        for (let i = 0; i < this._socialPlaces.length; i++) {
            this._socialPlaces[i].print()
        }
    }

}

module.exports = Database;
