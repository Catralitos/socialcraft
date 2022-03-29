import logging
from datetime import datetime
from javascript import AsyncTask, On
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

@AsyncTask(start=True)
def async_basic_agent_loop(task):

    ongoing_practice = None

    while not task.stopping:
        logger.info("🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹")
        logger.info(f"Start Agent Loop at {bot.time.time}")
        start_time = datetime.now()

        # create context to choose identity
        # context = Context()

        # perceive location
        # perceive people at location
        # perceive time of day

        # pick identity

        # pick practice

        # update ongoing practice

@On(bot, "time")
def handleTick(_):
    pass