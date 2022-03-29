import math
from carlos import Context
from abc import ABC, abstractmethod
from datetime import datetime


class Practice(ABC):

    def __init__(self, bot, name: str, timeout: float = 20) -> None:
        self.__salience = 0
        self.__name = name
        self._bot = bot
        self.__start_time = None
        self.__timeout = timeout

    @property
    def salience(self) -> float:
        return self.__salience

    @property
    def name(self) -> str:
        return self.__name

    @abstractmethod
    def is_possible(self) -> bool:
        pass

    @abstractmethod
    def update_salience(self, context: Context) -> float:
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
        return f"{self.__name} [{self.__salience}]"
