from carlos.practice import Practice


class Eat(Practice):

    @staticmethod
    def salience(agent, context):
        return max(0, agent.kb["hunger"] - agent.kb["hunger_threshold"] / agent.kb["hunger"])

    @staticmethod
    def execution(agent):
        pass
