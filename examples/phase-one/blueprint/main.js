//Import the logger
const Logger = require('js-logger');
Logger.get('Main');
Logger.setLevel(Logger.DEBUG);

let logHandler = Logger.createDefaultHandler({
    formatter: function (messages, context) {
        // prefix each log message with a timestamp.
        messages.unshift(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds())
    }
})
Logger.setHandler(logHandler);

//Initiating and connecting the SocialCraft handler, as well as assigning the bot
const SocialcraftHandler = require("./socialcraft_handler.js"); //DÁ
let handler = new SocialcraftHandler();
handler.connect();
const bot = handler.bot;

//Setting the minimum time for an update
const UpdateMinTime = 2500

//Context class (for perceiving surroundings)
const Context = require("./logic/context");

//Create agent instance
const Agent = require("./logic/agent")
const agent = new Agent(bot, handler)

//Create database instance
const Database = require("./logic/database")
const database = new Database(bot, handler, agent)
database.addHouses();
database.addSocialPlaces();
database.addWorkPlaces();
database.mergeLocationsList();
database.addPractices();
database.addJobs();
database.addIdentities();
database.printAll();

//handle types of movement
const WorkPlace = require("./logic/workPlace.js")
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const collectBlock = require('mineflayer-collectblock');
const mcData = require('minecraft-data')(bot.version)

const normalMove = new Movements(bot, mcData)
const digAndStackMove = new Movements(bot, mcData)
normalMove.canDig = false
normalMove.allow1by1towers = false
//normalMove.allowFreeMotion = true
//digAndStackMove.allowFreeMotion = true
let avoidFences = new Set();
let fence_blocks = Object.values(bot.registry.blocksByName).filter(i => i.name.endsWith('_fence'))
fence_blocks.forEach(i => avoidFences.add(i.id))
normalMove.blocksToAvoid = avoidFences
digAndStackMove.blocksToAvoid = avoidFences

//Set up everything to call the main loop
let botWorking = true;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

bot.on("spawn", () => {
    asyncBasicAgentLoop(handler, agent, normalMove, digAndStackMove).then(() => console.log("Loop done"))
});

//Main loop
async function asyncBasicAgentLoop(handler, agent, normalMove, digAndStackMove) {

    let ongoingPractice = null;

    while (botWorking) {

        Logger.info("🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹")
        //Logger.info("Start Agent Loop at " + bot.time.time)
        let timeOfDay = (bot.time.timeOfDay + 6000) % 24000
        Logger.info("Time of day is " + timeOfDay)
        let startTime = Date.now()

        if (handler.bot.isSleeping) {
            Logger.log("The agent is sleeping!")
        } else {

            //update job
            agent.updateJob(database.getShuffledJobs())
            Logger.info("Agent's Current Job is " + agent._current_job._name)

            //gather context
            let context = new Context(database, agent)
            let location = database.getLocationByName(context._location._name)

            Logger.info("Agent's current coordinates are " + handler.bot.entity.position)
            if (location) {
                Logger.info("Agent's Current Location is " + context._location._name)
                //adjust movement type
                if (location && location instanceof WorkPlace && location._canDigAndStack) {
                    handler.bot.pathfinder.setMovements(digAndStackMove)
                    //handler.bot.collectBlocks.movements = digAndStackMove
                } else {
                    handler.bot.pathfinder.setMovements(normalMove)
                    //handler.bot.collectBlocks.movements = normalMove
                }
            }

            agent.setValidIdentities(context, database._identities)
            Logger.info("Valid Identities are: ")
            for (let i = 0; i < agent._current_identities.length; i++) {
                Logger.info("      " + agent._current_identities[i]._name)
            }

            if (ongoingPractice != null) {
                //finish practice if no longer possible or it has ended
                if (!ongoingPractice.isPossible() || ongoingPractice.hasEnded()) {
                    Logger.info("🛑 Exit Practice " + ongoingPractice._name)
                    ongoingPractice.exit()
                    ongoingPractice = null
                }
                //continue current practice
                else {
                    Logger.info("🔃 Update Practice " + ongoingPractice._name)
                    ongoingPractice.update()
                }
            } else {

                let availablePractices = database.getAvailablePractices()

                Logger.info("Available Practices are: ")
                //filter practices available and sort from most salient to least salient
                let mostSalientPractice = agent.getMostSalientPractice(context, availablePractices)
                //print available practices in the above method ^^^

                //start most salient practice if it is salient enough
                if (mostSalientPractice !== null && mostSalientPractice !== undefined) {
                    Logger.info("Most salient practice was " + mostSalientPractice._name)
                    ongoingPractice = mostSalientPractice
                    ongoingPractice.setup(context)
                    if (ongoingPractice.isPossible()) {
                        Logger.info("🚀 Start Practice " + ongoingPractice._name)
                        ongoingPractice.start()
                    } else {
                        Logger.info("🚫 Can't Start Practice " + ongoingPractice._name)
                        ongoingPractice = null;
                    }
                }
                //do nothing if there's no good practice
                else {
                    Logger.info("⭕ Do nothing")
                }
            }

        }
        let timeSpent = Date.now() - startTime;
        Logger.info("Last update took " + timeSpent + " milliseconds")


        if (timeSpent < UpdateMinTime) {
            let timeToWait = UpdateMinTime - timeSpent;
            Logger.info("Waiting " + timeToWait + " milliseconds")
            await sleep(timeToWait)
        } else {
            Logger.info("Not waiting!")
        }

    }
}


