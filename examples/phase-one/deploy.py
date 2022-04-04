import json
from collections import ChainMap
from socialcraft import AgentManager
import pathlib
import os

if __name__ == "__main__":

    print("Starting Agent Manager...")
    manager = AgentManager(
        minecraft_host="host.docker.internal",
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

    print("Deploying agents...")
    f = open(
        'C:\\Users\\catra\\Documents\\RepositoriosGit\\socialcraft\\examples\\phase-one\\blueprint\\logic\\config\\Scenarios\\Phase 1\\Agents.json')
    data = json.load(f)

    # read beds from JSON (ignoring for now, cause I have no world)
    # read workplaces from JSON (ignoring for now, cause I have no world)
    # read agents from JSON

    agent_list = []

    for agent in data["agents"]:
        kb = dict(ChainMap(*agent["knowledge_base"]))
        pt = dict(ChainMap(*agent["personality_traits"]))
        r = dict(ChainMap(*agent["relationships"]))
        f = dict(ChainMap(*agent["friendships"]))
        lo = dict(ChainMap(*agent["loves"]))
        aux = manager.create_agent(agent["name"], blueprint=agent_blueprint, custom_envs={
            "job": agent["job"],
            "knowledge_base": kb,
            "personality_traits": pt,
            "relationships": r,
            "friendships": f,
            "loves": lo
        })
        aux.deploy()
        agent_list.append(aux)

    print("Agents deployed!")
