const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock');
const {GoalNear} = require('mineflayer-pathfinder').goals
const Practice = require("../../../practice.js")
const {Vec3} = require("vec3");
const minecraftData = require('minecraft-data')
const mcData = minecraftData('1.12')
const seedList = [435, 295, 391, 392, 39, 40, 361, 362]

const cropType = 'carrot'

const seedName = 'carrot';
const harvestName = 'carrot';

class PlantCrops extends Practice {

    _targetFarmBlock;
    _targetSeed;
    _centralPoint;
    _finishedPlanting;

    constructor(bot, agent, timeout = 20) {
        super(bot, "PlantCrops", agent, timeout);
        this._targetFarmBlock = null;
        this._centralPoint = null;
        this._finishedPlanting = false;
    }

    getSalience(context) {
        if (!(this._agent._current_job._name === "Farmer" && this._agent._current_job.onTheJob(this._agent._bot.time.timeOfDay)
            && this._agent._current_job._location === context._location)) {
            return Number.NEGATIVE_INFINITY
        }
        let centralPoint = this._agent._current_job._location.getCentralPointFlat()
        let radius = this._agent._current_job._location.getRadius()
        let blocks = this._bot.findBlock({
                point: centralPoint,
                matching: block => {
                    console.log(block.position)
                    return block.type === 60
                },
                maxDistance: radius,
                count: 50
            }
        )
        return blocks.length > 0 ? 1 : Number.NEGATIVE_INFINITY
    }

    setup(context) {
        this._targetSeed = mcData.itemsByName["wheat_seeds"]
        let centralPoint = this._agent._current_job._location.getCentralPoint()
        let radius = this._agent._current_job._location.getRadius()
        let blocks = this._bot.findBlock({
                point: centralPoint,
                matching: block => {
                    return block.type === 60
                },
                maxDistance: radius,
                count: 50
            }
        )
        if (blocks.length > 0) {
            this._targetFarmBlock = this._bot.blockAt(blocks[Math.floor(Math.random() * blocks.length)])
        }
    }

    start() {
        super.start()
        let goal = new GoalNear(this._targetFarmBlockPos.x, this._targetFarmBlockPos.y, this._targetFarmBlockPos.z, 1)
        this._bot.pathfinder.goto(goal).then(r => this.plantSeed())
    }

    plantSeed() {
        begin(this._targetFarmBlock, this._targetSeed, this._bot).then(r => {
            this._finishedPlanting = true
        })

        async function begin(targetFarmBlock, targetSeed, bot) {
            if (targetFarmBlock) {
                try {
                    if (!bot.heldItem || bot.heldItem !== targetSeed) {
                        await bot.equip(targetSeed);
                    }
                    await bot.placeBlock(targetFarmBlock, new Vec3(0, 1, 0));
                } catch (err) {
                    console.log(err) // Handle errors, if any
                }
            }
        }
    }

    isPossible() {
        return this._targetFarmBlock && this._targetSeed
    }

    hasEnded() {
        return super.hasEnded() || this._finishedPlanting;
    }

    exit() {
        super.exit()
        //this.agent.incrementItemInKnowledgeBase("crop_stock")
        this._targetFarmBlock = null;
        this._targetSeed = null;
        this._finishedPlanting = false;
        this._bot.pathfinder.setGoal(null);
    }
}

module.exports = {PlantCrops};

