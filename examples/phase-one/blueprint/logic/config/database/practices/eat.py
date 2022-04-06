import random
from perceptions import Block
from logic.practice import Practice
from logic.context import Context
from vector3 import Vector3
from javascript import require

pathfinder = require("mineflayer-pathfinder")
Vec3 = require("vec3")


class Eat(Practice):

    def __init__(self, bot) -> None:
        super().__init__(bot, "Eat")

    def salience(self, context):
        # return max(0, self._bot["knowledge_base"]["hunger"] - self._bot["knowledge_base"]["hunger_threshold"] / self._bot["knowledge_base"]["hunger"])
        return random.randint(0, 1)

    def setup(self, context: Context) -> None:
        super().setup(context)

    def start(self):
        super().start()
        self._bot.chat("I want to eat")

    def update(self):
        super().update()

    def is_possible(self) -> bool:
        pass

    def has_ended(self) -> bool:
        return super().has_ended()

    def exit(self):
        super().exit()
