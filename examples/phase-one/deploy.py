import json
import os
import pathlib
from collections import ChainMap

from socialcraft import AgentManager

if __name__ == "__main__":

    print("Starting Agent Manager...")
    manager = AgentManager(
        minecraft_host="localhost",
        minecraft_port=25565,
        minecraft_version="1.12",
    )

    print("Started Agent Manager!")

    print("Creating Agent Blueprint...")
    path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)), "blueprint/")
    agent_blueprint = manager.generate_blueprint(name="builder", agent_source_path=str(path))
    print("Created Agent Blueprint!")

    print("Killing all dangling agents...")
    all_agents = manager.get_all_agents()
    for old_agent in all_agents:
        print(f"  Killing {old_agent.name}...")
        old_agent.kill()
        print(f"  RIP {old_agent.name}!")
    print("Killed all dangling agents!")

    print("Reading locations")
    f = open("blueprint/logic/config/scenarios/phase-1/Locations.json")
    data = json.load(f)

    houses = []
    socialPlaces = []
    workPlaces = []
    for house in data["houses"]:
        name = house["name"]
        bounding_box = house["bounding_box"]
        beds = []
        for bed in house["beds"]:
            beds.append(bed)
        aux = {
            "name": name,
            "bounding_box": bounding_box,
            "beds": beds
        }
        print(aux)
        houses.append(aux)

    for socialPlace in data["social_places"]:
        name = socialPlace["name"]
        bounding_box = socialPlace["bounding_box"]
        social_appropriateness = socialPlace["social_appropriateness"]
        aux = {
            "name": name,
            "bounding_box": bounding_box,
            "social_appropriateness": social_appropriateness
        }
        print(aux)
        socialPlaces.append(aux)

    for workPlace in data["work_places"]:
        name = workPlace["name"]
        bounding_box = workPlace["bounding_box"]
        can_dig_and_stack = workPlace["can_dig_and_stack"]
        aux = {
            "name": name,
            "bounding_box": bounding_box,
            "can_dig_and_stack": can_dig_and_stack
        }
        print(aux)
        workPlaces.append(aux)

    print("Deploying agents...")
    f = open("blueprint/logic/config/scenarios/phase-1/Agents.json")
    data = json.load(f)

    agent_list = []

    for agent in data["agents"]:
        name = agent["name"]
        job_infos = dict(ChainMap(*agent["jobs"]))
        kb = dict(ChainMap(*agent["knowledge_base"]))
        pt = dict(ChainMap(*agent["personality_traits"]))
        #r = dict(ChainMap(*agent["relationships"]))
        f = dict(ChainMap(*agent["friendships"]))
        lo = dict(ChainMap(*agent["loves"]))
        bed = agent["bed"]
        aux = manager.create_agent(agent["name"], blueprint=agent_blueprint, custom_envs={
            "name": name,
            "jobs": job_infos,
            "knowledge_base": kb,
            "personality_traits": pt,
            "friendships": f,
            "loves": lo,
            "houses": houses,
            "social_places": socialPlaces,
            "work_places": workPlaces,
            "bed": bed
        })
        aux.deploy()
        agent_list.append(aux)

print("Agents deployed!")
