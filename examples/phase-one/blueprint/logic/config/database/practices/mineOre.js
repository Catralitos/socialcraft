const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock');
const Practice = require("../../../practice.js")

const oreIds = [14, 15, 16, 21, 56, 73, 74, 129, 153]

class MineOre extends Practice {

    _targetOreBlock;
    _finishedDigging;

    constructor(bot, agent, timeout = 20) {
        super(bot, "MineOre", agent, timeout);
        this._targetOreBlock = null;
        this._finishedDigging = false;
    }

    getSalience(context) {
        return this._agent._current_job._name === "Miner"
        && this._agent._current_job.onTheJob(this._agent._bot.time.timeOfDay)
        && this._agent._current_job._location === context._location ? 2 : Number.NEGATIVE_INFINITY;
    }

    setup(context) {
        let centralPoint = this._agent._current_job._location.getCentralPoint()
        let radius = this._agent._current_job._location.getRadius()
        let blocks = this._bot.findBlocks({
                matching: block => {
                    return block.name.endsWith("_ore") || oreIds.includes(block.type)
                },
                maxDistance: radius,
                count: 50
            }
        )
        if (blocks.length > 0) {
            let index = Number.parseInt(this._agent._bed[3]) >= 5 ? 0 : Math.floor(Math.random() * blocks.length)
            this._targetOreBlock = this._bot.blockAt(blocks[index])
        }
    }

    start() {
        super.start()
        let bestTool = this._bot.pathfinder.bestHarvestTool(this._targetOreBlock)
        if (bestTool !== null) {
            this._bot.equip(bestTool, "hand").then(() => "Equipped " + bestTool.displayName);
        }
        this.getBlock()
    }

    getBlock() {
        begin(this._targetOreBlock, this._bot).then(r => {
            this._finishedDigging = true
        })

        async function begin(targetOreBlock, bot) {
            if (targetOreBlock) {
                try {
                    await bot.collectBlock.collect(targetOreBlock)
                } catch (err) {
                    console.log(err) // Handle errors, if any
                }
            }
        }
    }

    isPossible() {
        return  this._targetOreBlock
    }

    hasEnded() {
        return super.hasEnded() || this._finishedDigging
    }

    exit() {
        super.exit()
        this._agent.incrementItemInKnowledgeBase("ore_stock")
        this._targetOreBlock = null;
        this._finishedDigging = false;
        //this._bot.pathfinder.setGoal(null);
    }
}

module.exports = {MineOre};

