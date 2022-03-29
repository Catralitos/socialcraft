from carlos.practice import Practice


class Sleep(Practice):

    @staticmethod
    def salience(agent, context):
        if agent.kb["NighTime"]:
            aux = 0
            if context.num_agents > 1:
                aux = 1
            return max(0, ((agent.kb["energy_threshold"] - agent.kb["energy"]) / agent.kb[
                "energy_threshold"]) * (1 / (1 + aux)))
        return 0

    @staticmethod
    def execution(self, agent):
        pass
