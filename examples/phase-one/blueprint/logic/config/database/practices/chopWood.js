const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
//const mcData = require('minecraft-data')
const collectBlock = require('mineflayer-collectblock');
const {GoalNear} = require('mineflayer-pathfinder').goals
const Vec3 = require('vec3').Vec3;
const Practice = require("../../../practice.js");

class ChopWood extends Practice {

    _targetWoodBlockPos;
    _targetWoodBlock;
    _begunDigging;
    _finishedDigging;

    constructor(bot, agent, timeout = 20) {
        super(bot, "ChopWood", agent, timeout);
        this._targetWoodBlockPos = null
        this._targetWoodBlock = null;
        this._begunDigging = false;
        this._finishedDigging = false;
    }

    getSalience(context) {
        //O Job vai ser a saliência basicamente.
        // Enquanto ele trabalha, ele corta madeira, a não ser que algo seja mais importante
        return this._agent._current_job._name === "Lumberjack" && this._agent._current_job.onTheJob(this._agent._bot.time.timeOfDay) ? 1 : -5;
    }

    setup(context) {
        //block.type 17 means wood. For specific kinds of wood, use metadata too
        let blocks = this._bot.findBlocks({
                point: this._bot.entity.position,
                matching: block => {
                    return block.type === 17;
                },
                maxDistance: 256,
                count: 50
            }
        )
        console.log("Found " + blocks.length + " wood blocks")
        if (blocks.length > 0)
            this._targetWoodBlockPos = blocks[0]
    }

    start() {
        super.start()
        this._bot.chat("I am going to chop wood")
        begin().then(r => {});
        /*let bestTool = this._bot.pathfinder.bestHarvestTool(this._targetWoodBlock)
        if (bestTool !== null) {
            this._bot.equip(bestTool, "hand").then(() => "Equipped " + bestTool.displayName);
        }
        const mcData = require('minecraft-data')(this._bot.version)
        const defaultMove = new Movements(this._bot, mcData)
        defaultMove.canDig = true // Enable breaking of blocks when pathing
        let goal = new GoalNear(this._targetWoodBlockPos.x, this._targetWoodBlockPos.y, this._targetWoodBlockPos.z, 3)
        this._bot.pathfinder.setMovements(defaultMove)
        this._bot.pathfinder.setGoal(goal)*/

        async function begin() {
            try {
                await this._bot.collectBlock.collect(this._targetWoodBlock)
            } catch (err) {
                console.log(err) // Handle errors, if any
            }
        }

    }

    update() {
        console.log("Bot position " + this._bot.entity.position)
        console.log("Block position " + this._targetWoodBlockPos)
        if (this._bot.canDigBlock(this._targetWoodBlock) && !this._begunDigging) {
            console.log("In range of wood block")
            this._begunDigging = true;
            this._bot.dig(this._targetWoodBlock).then(r => {
                console.log("Finished digging wood block")
                this._finishedDigging = true
            })
        }
    }

    isPossible() {
        if (this._targetWoodBlockPos === null || this._targetWoodBlockPos === undefined) return false;
        this._targetWoodBlock = this._bot.blockAt(this._targetWoodBlockPos);
        //return this._bot.canDigBlock(this._targetWoodBlock)
        return true;
    }

    hasEnded() {
        return super.hasEnded() || this._finishedDigging;
    }

    exit() {
        super.exit()
        this.agent.incrementItemInKnowledgeBase("wood_stock")
        this._targetWoodBlockPos = null;
        this._targetWoodBlock = null;
        this._begunDigging = false;
        this._finishedDigging = false;
        this._bot.pathfinder.setGoal(null);
    }
}

module.exports = {ChopWood};

