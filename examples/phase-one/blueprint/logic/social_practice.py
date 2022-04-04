from abc import ABC, abstractmethod
from datetime import datetime

from logic.practice import Practice


class SocialPractice(Practice, ABC):

    @abstractmethod
    def accepted(self) -> None:
        pass
