const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock');
const Practice = require("../../../practice.js")
const minecraftData = require('minecraft-data')
const mcData = minecraftData('1.12')

//const cropList = [59, 434, 296, 391, 392, 103, 86, 127, 83, 39, 40]

const cropType = 'carrot'

const seedName = 'carrot';
const harvestName = 'carrot';

class HarvestCrops extends Practice {

    _targetCropBlock;
    _finishedDigging;

    constructor(bot, agent, timeout = 20) {
        super(bot, "HarvestCrops", agent, timeout);
        this._targetCropBlock = null;
        this._finishedDigging = false;
    }

    getSalience(context) {
        if (!(this._agent._current_job._name === "Farmer" && this._agent._current_job.onTheJob(this._agent._bot.time.timeOfDay)
            && this._agent._current_job._location === context._location)) {
            return Number.NEGATIVE_INFINITY
        }
        let centralPoint = this._agent._current_job._location.getCentralPoint()
        let radius = this._agent._current_job._location.getRadius()
        let blocks = this._bot.findBlocks({
                point: centralPoint,
                matching: block => {
                    return (block.name === harvestName && block.metadata === 7);
                },
                maxDistance: radius,
                count: 50
            }
        )
        return blocks.length > 0 ? 1 : Number.NEGATIVE_INFINITY
    }

    setup(context) {
        let centralPoint = this._agent._current_job._location.getCentralPoint()
        let radius = this._agent._current_job._location.getRadius()
        let blocks = this._bot.findBlocks({
                point: centralPoint,
                matching: block => {
                    return (block.name === harvestName && block.metadata === 7);
                },
                maxDistance: radius,
                count: 50
            }
        )
        if (blocks.length > 0) {
            this._targetCropBlock = this._bot.blockAt(blocks[Math.floor(Math.random() * blocks.length)])
        }
    }

    start() {
        super.start()
        let bestTool = this._bot.pathfinder.bestHarvestTool(this._targetCropBlock)
        if (bestTool !== null) {
            this._bot.equip(bestTool, "hand").then(() => "Equipped " + bestTool.displayName);
        }
        this.getBlock()
    }

    getBlock() {
        begin(this._targetCropBlock, this._bot, mcData).then(r => {
            this._finishedDigging = true
        })

        async function begin(targetCropBlock, bot, mcData) {
            if (targetCropBlock) {
                try {
                    await bot.collectBlock.collect(targetCropBlock)
                    if (!bot.heldItem || bot.heldItem.name !== seedName) await bot.equip(mcData.itemsByName[seedName].id);
                    let dirt = bot.blockAt(targetCropBlock.position.offset(0, -1, 0));
				     await bot.placeBlock(dirt, new Vec3(0, 1, 0));
                } catch (err) {
                    console.log(err) // Handle errors, if any
                }
            }
        }
    }

    isPossible() {
        return this._targetCropBlock
    }

    hasEnded() {
        return super.hasEnded() || this._finishedDigging;
    }

    exit() {
        super.exit()
        this.agent.incrementItemInKnowledgeBase("crop_stock")
        this._targetCropBlock = null;
        this._finishedDigging = false;
        //this._bot.pathfinder.setGoal(null);
    }
}

module.exports = {HarvestCrops};

