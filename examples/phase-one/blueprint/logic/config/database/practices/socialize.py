from random import random
from perceptions import Block
from logic.social_practice import SocialPractice
from logic.context import Context
from vector3 import Vector3
from javascript import require

pathfinder = require("mineflayer-pathfinder")
Vec3 = require("vec3")


class Socialize(SocialPractice):

    def __init__(self, bot) -> None:
        super().__init__(bot, "Socialize")

    def salience(self, context):
        if context.num_people > 1:
            return 0.7
        return 0

    def setup(self, context: Context) -> None:
        super().setup(context)

    def start(self):
        super().start()
        self._bot.chat("I want to socialize")

    def update(self):
        super().update()

    def is_possible(self) -> bool:
        pass

    def has_ended(self) -> bool:
        return super().has_ended()

    def exit(self):
        super().exit()

    @staticmethod
    def accepted(agent):
        pass
