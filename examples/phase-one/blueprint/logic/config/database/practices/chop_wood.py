from random import random
from perceptions import Block
from logic.practice import Practice
from logic.context import Context
from vector3 import Vector3
from javascript import require, eval_js

mineflayer = require("mineflayer")
pathfinder = require("mineflayer-pathfinder")
Vec3 = require("vec3")


class ChopWood(Practice):
    __target_wood_block: Block

    WOOD_BLOCKS = [35, 36, 37, 38, 39, 40, 46, 41, 42, 43, 44, 45]

    def __init__(self, bot) -> None:
        super().__init__(bot, "ChopWood")

    def salience(self, context):
        if self._bot["knowledge_base"]["energy"] > 30:
            if self._bot["knowledge_base"]["wood_stock"] <= 15:
                return 0.6
        return 0

    def setup(self, context: Context) -> None:
        super().setup(context)
        target_block = eval_js(''' bot.findBlock({ matching: block => block.type == 'oak_id' }) ''')
        self.__target_wood_block = target_block
        #blocks = self._bot.findBlocks({
        #    point: self._bot.entity.position,
        #    lambda block: => {
        #if block and WOOD_BLOCKS.includes(block.id))
        #{
        #const blockAbove = self._bot.blockAt(block.position.offset(0, 1, 0))
        #return !blockAbove | | blockAbove.type == = 0
        #}
        #})
        #if len(blocks) > 0:
        #    self.__target_wood_block = blocks[0]

    def start(self):
        super().start()
        self._bot.chat("I want to chop wood")
        goal = pathfinder.goals.GoalBreakBlock(
            self.__target_wood_block.position.x,
            self.__target_wood_block.position.y,
            self.__target_wood_block.position.z,
            self._bot,
        )
        print(self.__target_wood_block.position)

        self._bot.pathfinder.setGoal(goal)

    def update(self):
        super().update()
        position = Vector3(self._bot.entity.position)
        if position.distance_squared_to(self.__target_wood_block.position) < 16:
            block = self._bot.blockAt(self.__target_wood_block.position.to_vec3())
            self._bot.dig(block)

    def is_possible(self) -> bool:
        print(self.__target_wood_block is not None)
        can_dig = self._bot.canDigBlock(self._bot.blockAt(self.__target_wood_block.position.to_vec3()))
        print(can_dig)
        print(self._bot.blockAt(self.__target_wood_block.position.to_vec3()))
        return self.__target_wood_block is not None and can_dig

    def has_ended(self) -> bool:
        return super().has_ended()

    def exit(self):
        super().exit()
