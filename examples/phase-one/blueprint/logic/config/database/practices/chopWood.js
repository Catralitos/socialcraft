const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock');
const Practice = require("../../../practice.js")

const woodIds = [17, 162]

class ChopWood extends Practice {

    _targetWoodBlock;
    _finishedDigging;

    constructor(bot, agent, timeout = 20) {
        super(bot, "ChopWood", agent, timeout);
        this._targetWoodBlock = null;
        this._centralPoint = null;
        this._finishedDigging = false;
    }

    getSalience(context) {
        return this._agent._current_job._name === "Lumberjack"
        && this._agent._current_job.onTheJob(this._agent._bot.time.timeOfDay) &&
        this._agent._current_job._location === context._location ? 2 : Number.NEGATIVE_INFINITY;
    }

    setup(context) {
        this._centralPoint = this._agent._current_job._location.getCentralPoint()
        let radius = this._agent._current_job._location.getRadius()
        let blocks = this._bot.findBlocks({
                point:  this._centralPoint,
                matching: block => {
                    return block.name.endsWith("_wood") || woodIds.includes(block.type)
                },
                maxDistance: radius,
                count: 50
            }
        )
        if (blocks.length > 0) {
            let index = Number.parseInt(this._agent._bed[3]) >= 5 ? 0 : Math.floor(Math.random() * blocks.length)
            this._targetWoodBlock = this._bot.blockAt(blocks[index])
        }
    }

    start() {
        super.start()
        let bestTool = this._bot.pathfinder.bestHarvestTool(this._targetWoodBlock)
        if (bestTool !== null) {
            this._bot.equip(bestTool, "hand").then(() => "Equipped " + bestTool.displayName);
        }
        this.getBlock()
    }

    getBlock() {
        begin(this._targetWoodBlock, this._bot).then(r => {
            this._finishedDigging = true
        })

        async function begin(targetWoodBlock, bot) {
            if (targetWoodBlock) {
                try {
                    await bot.collectBlock.collect(targetWoodBlock)
                } catch (err) {
                    console.log(err) // Handle errors, if any
                }
            }
        }
    }

    isPossible() {
        return this._targetWoodBlock
    }

    hasEnded() {
        return super.hasEnded() || this._finishedDigging;
    }

    exit() {
        super.exit()
        this._agent.incrementItemInKnowledgeBase("wood_stock")
        this._targetWoodBlock = null;
        this._finishedDigging = false;
        //this._bot.pathfinder.setGoal(null);
    }
}

module.exports = {ChopWood};

