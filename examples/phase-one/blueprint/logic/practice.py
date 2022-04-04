import math
from logic import Context
from abc import ABC, abstractmethod
from datetime import datetime


class Practice(ABC):

    def __init__(self, bot, name: str, timeout: float = 20) -> None:
        self.__name = name
        self._bot = bot
        self.__start_time = None
        self.__timeout = timeout

    @abstractmethod
    def salience(self, context) -> float:
        pass

    @property
    def name(self) -> str:
        return self.__name

    @abstractmethod
    def is_possible(self) -> bool:
        pass

    @abstractmethod
    def has_ended(self) -> bool:
        return (datetime.now() - self.__start_time).total_seconds() > self.__timeout

    @abstractmethod
    def setup(self, context: Context) -> None:
        pass

    @abstractmethod
    def start(self) -> None:
        self.__start_time = datetime.now()
        pass

    @abstractmethod
    def update(self) -> None:
        pass

    @abstractmethod
    def exit(self) -> None:
        pass

    def __str__(self) -> str:
        return f"{self.__name} [{self.salience()}]"
