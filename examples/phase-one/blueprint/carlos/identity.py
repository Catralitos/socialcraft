from abc import ABC, abstractmethod
from carlos import Context


class Identity(ABC):

    def __init__(self, bot, name: str, rules: []) -> None:
        self.__salience_rules = rules
        self.__name = name
        self._bot = bot
        self.__salience = 0

    @property
    def salience(self) -> float:
        return self.__salience

    @property
    def name(self) -> str:
        return self.__name

    @abstractmethod
    def update_salience(self, context: Context) -> float:
        pass

    def get_salience_rule(self, practice):
        for rule in self.__salience_rules:
            if practice == rule[0]:
                return rule[1]
            



