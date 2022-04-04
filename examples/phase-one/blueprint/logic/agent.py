from logic import Practice, Database
from javascript import require
# from pathfinder import Movements

pathfinder = require("mineflayer-pathfinder")
mineflayer = require("mineflayer")
movements = pathfinder.Movements
block = require("mineflayer-block")


class Agent:

    def __init__(self, agent_data, bot):
        self.name = agent_data.name
        self.job = agent_data.job
        self.knowledge_base = agent_data.knowledge_base
        self.personality_traits = agent_data.personality_traits
        self.relationships = agent_data.relationships
        self.friendships = agent_data.friendships
        self.loves = agent_data.loves
        self.current_identities = []
        self.current_practice = None
        self.bot = bot

    def most_salient_identity(self):
        highest_salience = 0
        most_salient_identity = None
        for identity in Database.identities:
            current_salience = identity.salience(self)
            if current_salience >= highest_salience:
                highest_salience = current_salience
                most_salient_identity = identity
        return most_salient_identity

    def most_salient_practice(self):
        highest_salience = 0
        most_salient_practice = None
        for practice in Database.practices:
            current_salience = practice.salience(self)
            for identity in self.current_identities:
                current_salience *= identity.get_salience_rule(practice)
            if current_salience >= highest_salience:
                highest_salience = current_salience
                most_salient_practice = practice
        return most_salient_practice
    
    def locate_block(self, matching_blocks: []):
        mcdata = self.bot.version
        movements_aux = movements(self.bot, mcdata)
        block = None
        movements_aux.canDig = False
        self.bot.pathfinder.setMovement(movements)
        
        if matching_blocks is not None and matching_blocks.len > 0:
            blocks = self.bot.findBlocks(matching_blocks, 200, 100)
            block = blocks[0]

        return block


