import logging
import random
from logic.config.database.practices import (
    ChopWood, Eat, Sleep, Socialize
)
from datetime import datetime
from javascript import AsyncTask, On
from logic.context import Context
from socialcraft_handler import Socialcraft_Handler
import sys

# Init Logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

# Configuration
Update_Min_Time = 2500

# Init Socialcraft Handler
handler = Socialcraft_Handler()
handler.connect()

bot = handler.bot

# add every identity
# add every practice

practices = []
bot.kb = {}

practices.append(
    ChopWood(bot)
)
practices.append(
    Eat(bot)
)
practices.append(
    Sleep(bot)
)
practices.append(
    Socialize(bot)
)


@AsyncTask(start=True)
def async_basic_agent_loop(task):
    ongoing_practice = None

    while not task.stopping:
        logger.info("🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹")
        logger.info(f"Start Agent Loop at {bot.time.time}")
        start_time = datetime.now()

        # create context to choose identity
        context = Context()

        # perceive location
        # perceive people at location
        # perceive time of day

        # pick identity

        # pick practice

        # update ongoing practice

        random.shuffle(practices)
        practices.sort(reverse=True, key=lambda practice: practice.salience(context))

        for practice in practices:
            logger.debug("{:<30} {:<5}".format(practice.name, practice.salience(context)))

        # Update Ongoing Practice
        if ongoing_practice is not None:
            if not ongoing_practice.is_possible() or ongoing_practice.has_ended():
                logger.info(f"🛑 Exit Practice {ongoing_practice}")
                ongoing_practice.exit()
                ongoing_practice = None
            else:
                logger.info(f"🔃 Update Practice {ongoing_practice}")
                ongoing_practice.update()
        else:
            if practices[0].salience > 0:
                ongoing_practice = practices[0]
                logger.info(f"🚀 Start Practice {ongoing_practice}")
                ongoing_practice.setup(context)
                if ongoing_practice.is_possible():
                    ongoing_practice.start()
            else:
                logger.info("⭕ Do nothing")

        time_spent = datetime.now() - start_time
        milliseconds = (time_spent.days * 24 * 60 * 60 + time_spent.seconds) * 1000 + time_spent.microseconds / 1000.0
        logger.info(f"Last update took {milliseconds} miliseconds")

        if milliseconds < Update_Min_Time:
            time_to_wait = Update_Min_Time - int(milliseconds)
            logger.info(f"Waiting {time_to_wait} miliseconds")
            task.wait(time_to_wait / 1000)
        else:
            logger.info(f"Not waiting!")




@On(bot, "time")
def handleTick(_):
    pass
