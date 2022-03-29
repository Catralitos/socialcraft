from random import random
from perceptions import Block
from carlos.practice import Practice
from carlos.context import Context
from vector3 import Vector3
from javascript import require

pathfinder = require("mineflayer-pathfinder")
Vec3 = require("vec3")


class ChopWood(Practice):
    __target_wood_block: Block

    def __init__(self, bot) -> None:
        super().__init__(bot, "ChopWood")

    def setup(self, context: Context) -> None:
        super().setup(context)
        blocks = context.get_block_positions_by_type("Oak Log")
        if len(blocks) > 0:
            self.__target_wood_block = random.choice(blocks)

    def start(self):
        super().start()
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
            block = self._bot.blockAt(self.__target_wood_block.position.toVec3())
            self._bot.dig(block)

    def is_possible(self) -> bool:
        print(self.__target_wood_block is not None)
        can_dig = self._bot.canDigBlock(self._bot.blockAt(self.__target_wood_block.position.toVec3()))
        print(can_dig)
        print(self._bot.blockAt(self.__target_wood_block.position.toVec3()))
        return self.__target_wood_block is not None and can_dig

    def has_ended(self) -> bool:
        return super().has_ended()

    def exit(self):
        super().exit()
