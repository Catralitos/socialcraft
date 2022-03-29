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

    # read beds from JSON
    # read workplaces from JSON
    # read agents from JSON
