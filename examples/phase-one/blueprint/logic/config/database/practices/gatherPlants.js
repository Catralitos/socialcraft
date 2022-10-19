const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock');
const Practice = require("../../../practice.js")
const {Vec3} = require("vec3");

const plantNames = ["dandelion", "poppy", "blue_orchid", "allium", "azure_bluet", "red_tulip",
    "orange_tulip", "white_tulip", "pink_tulip", "oxeye_daisy", "cornflower", "lily_of_the_valley",
    "wither_rose", "sunflower", "lilac", "rose_bush", "peony", "brown_mushroom", "red_mushroom"]

class GatherPlants extends Practice {

    _targetPlantBlock;
    _finishedDigging;

    constructor(bot, agent, timeout = 20) {
        super(bot, "GatherPlants", agent, timeout);
        this._targetPlantBlock = null;
        this._finishedDigging = false;
    }

    getSalience(context) {
        return this._agent._current_job._name === "Gatherer"
        && this._agent._current_job.onTheJob(this._agent._bot.time.timeOfDay)
        && this._agent._current_job._location === context._location ? 2 : Number.NEGATIVE_INFINITY;
    }

    setup(context) {
        let centralPoint = this._agent._current_job._location.getCentralPoint()
        let radius = this._agent._current_job._location.getRadius()
        let blocks = this._bot.findBlocks({
                point: new Vec3(7, 75, 39),
                matching: block => {
                    return plantNames.includes(block.name)
                },
                maxDistance: 50,
                count: 50
            }
        )
        if (blocks.length > 0) {
            //Math.floor(Math.random() * blocks.length)
            this._targetPlantBlock = this._bot.blockAt(blocks[0])
        }
    }

    start() {
        super.start()
        let bestTool = this._bot.pathfinder.bestHarvestTool(this._targetPlantBlock)
        if (bestTool !== null) {
            this._bot.equip(bestTool, "hand").then(() => "Equipped " + bestTool.displayName);
        }
        this.getBlock()
    }

    getBlock() {
        begin(this._targetPlantBlock, this._bot).then(r => {
            this._finishedDigging = true
        })

        async function begin(targetPlantBlock, bot) {
            if (targetPlantBlock) {
                try {
                    await bot.collectBlock.collect(targetPlantBlock)
                } catch (err) {
                    console.log(err) // Handle errors, if any
                }
            }
        }
    }

    isPossible() {
        return this._targetPlantBlock
    }

    hasEnded() {
        return super.hasEnded() || this._finishedDigging;
    }

    exit() {
        super.exit()
        this._agent.incrementItemInKnowledgeBase("plant_stock")
        this._targetPlantBlock = null;
        this._finishedDigging = false;
        //this._bot.pathfinder.setGoal(null);
    }
}

module.exports = {GatherPlants};

