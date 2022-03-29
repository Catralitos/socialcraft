from carlos.social_practice import SocialPractice


class Socialize(SocialPractice):

    @staticmethod
    def salience(agent, context):
        if context.num_people > 1:
            return 0.7
        return 0

    @staticmethod
    def execution(agent, context):
        pass

    @staticmethod
    def accepted(agent):
        pass
