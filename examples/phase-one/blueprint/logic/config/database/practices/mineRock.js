const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock');
const {GoalNear} = require('mineflayer-pathfinder').goals
const Practice = require("../../../practice.js")

const rockIds = [1, 4, 7, 13]

class MineRock extends Practice {

    _targetRockBlockPos;
    _targetRockBlock;
    _finishedDigging;
    _begunDigging;

    constructor(bot, agent, timeout = 20) {
        super(bot, "MineRock", agent, timeout);
        this._targetRockBlockPos = null
        this._targetRockBlock = null;
        this._finishedDigging = false;
        this._begunDigging = false;
    }

    getSalience(context) {
        //O Job vai ser a saliência basicamente.
        // Enquanto ele trabalha, ele corta madeira, a não ser que algo seja mais importante
        return this._agent._current_job._name === "Miner" && this._agent._current_job.onTheJob(this._agent._bot.time.timeOfDay) ? 1 : -5;
    }

    setup(context) {
        let blocks = this._bot.findBlocks({
                point: this._bot.entity.position,
                matching: block => {
                    return rockIds.includes(block.type);
                },
                maxDistance: 256,
                count: 50
            }
        )
        console.log("Found " + blocks.length + " rock blocks")
        if (blocks.length > 0)
            this._targetRockBlockPos = blocks[0]
    }

    start() {
        super.start()
        this._bot.chat("I am going to mine rock")
        //begin().then(r => {});
        let bestTool = this._bot.pathfinder.bestHarvestTool(this._targetRockBlock)
        if (bestTool !== null) {
            this._bot.equip(bestTool, "hand").then(() => "Equipped " + bestTool.displayName);
        }
        let goal = new GoalNear(this._targetRockBlock.x, this._targetRockBlock.y, this._targetRockBlock.z, 3)
        this._bot.pathfinder.setGoal(goal)
        async function begin() {
            try {
                await this._bot.collectBlock.collect(this._targetRockBlock)
            } catch (err) {
                console.log(err) // Handle errors, if any
            }
        }

    }

    update() {
        console.log("Bot position " + this._bot.entity.position)
        console.log("Block position " + this._targetRockBlockPos)
        if (this._bot.canDigBlock(this._targetRockBlock) && !this._begunDigging) {
            console.log("In range of rock block")
            this._begunDigging = true;
            this._bot.dig(this._targetRockBlock).then(() => {
                console.log("Finished digging rock block")
                this._finishedDigging = true
            })
        }
    }

    isPossible() {
        if (this._targetRockBlockPos === null || this._targetRockBlockPos === undefined) return false;
        this._targetRockBlock = this._bot.blockAt(this._targetRockBlockPos);
        return true;
    }

    hasEnded() {
        return super.hasEnded() || this._finishedDigging
    }

    exit() {
        super.exit()
        this._agent.incrementItemInKnowledgeBase("rock_stock")
        this._targetRockBlockPos = null;
        this._targetRockBlockPos = null;
        this._begunDigging = false;
        this._finishedDigging = false;
        this._bot.pathfinder.setGoal(null);
    }
}

module.exports = {MineRock};

