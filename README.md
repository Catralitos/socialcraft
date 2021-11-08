# SocialCraft

## Usage

To use the socialcraft library, the user needs to have a Docker-Engine (local or remote) and a Minecraft server (local or remote).

### Create an agent template
```
agent_template = AgentTemplate('agent_script.py')
```

### Create an Agent Manager
```
agent_manager = AgentManager(
    docker_url="...", 
    minecraft_server_url="...")
```

### Create an agent instance based on a template
```
agent = agent_manager.create_agent("Maria1", agent_template)
```

### Deploy the agent into the Minecraft Server
```
agent.deploy() 
```
or 
```
agent_manager.deploy_agent(agent.name)
```

## Deploy Minecraft Server

### Using docker

```
docker run -d -p 25565:25565 -e EULA=TRUE -e ONLINE_MODE=FALSE -e MAX_PLAYERS=50 --name mc itzg/minecraft-server
```
