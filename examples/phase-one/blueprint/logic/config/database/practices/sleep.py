from logic.practice import Practice

#from random import random
import random
from perceptions import Block
from logic.practice import Practice
from logic.context import Context
from vector3 import Vector3
from javascript import require

pathfinder = require("mineflayer-pathfinder")
Vec3 = require("vec3")


class Sleep(Practice):

    def __init__(self, bot) -> None:
        super().__init__(bot, "Sleep")

    def salience(self, context):
        return random.randint(0, 1)
        #if self._bot["knowledge_base"]["night_time"]:
        #    aux = 0
        #    if context.num_agents > 1:
        #        aux = 1
        #    return max(0, ((self._bot["knowledge_base"]["energy_threshold"] - self._bot["knowledge_base"]["energy"]) / self._bot["knowledge_base"][
        #        "energy_threshold"]) * (1 / (1 + aux)))
        #return 0

    def setup(self, context: Context) -> None:
        super().setup(context)

    def start(self):
        super().start()
        self._bot.chat("I want to sleep")

    def update(self):
        super().update()

    def is_possible(self) -> bool:
        pass

    def has_ended(self) -> bool:
        return super().has_ended()

    def exit(self):
        super().exit()