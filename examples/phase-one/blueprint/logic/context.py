from abc import abstractmethod
from datetime import datetime
from typing import Dict, List
from vector3 import Vector3
import math
from perceptions import Perception, Block


class Context:

    def __init__(self) -> None:
        self.num_people = 2

