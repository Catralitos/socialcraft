from enum import Enum


class Relationships(Enum):
    BOSS = 1,
    MARRIED = 2,
    FRIEND = 3


class Database:

    def __init__(self):
        config_folder = 'config'
        identities = []
        practices = []
        agents = []
        locations = []
        affinities = []
        relationships = Relationships
