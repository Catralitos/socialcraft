# SocialCraft

## Abstract

Games keep expanding in scope, providing the player with increasingly bigger worlds to explore and fully immerse themselves in. And with bigger worlds, comes the need for designers to populate them with interesting characters, that feel like part of the world and that the player can forge a bond with. However,the effort required to individually author each character to reach this desired depth is unfeasible.

Our research goal is to remove the need for individual authoring and provide a framework where designers dictate how characters should behave, but still do not need to concern themselves with the minutia of the task. We aim to apply a model that allows for a large-scale character network to be deployed, with characters that behave like they are members of society, and have interpersonal relationships with each other.

In order to test our framework, we created two villages of agents in Minecraft, one very expressive and sociable, and one not as much. We had our subjects play Minecraft, and follow the lumberjack of the sociable village, who worked with their other village counterpart, for a full day. This allowed the subjects to observe each agent’s behavior and contrast them.

Results were mixed, but promising, with agents doing great in many of the parameters set for believability, but having a lot of technical problems.

Full details as to how the code works and can be found in the [thesis document](SocialAgentsInMinecraft.pdf).

## Usage

To use the socialcraft library, the user needs to have a Docker-Engine (local or remote) and a Minecraft server (local or remote).

I won't be getting too technical into aspects related to the mechanics/specifics of Minecraft and setting up a server for it.

### Prepare the Python and Node environment

Run the following commands to install all dependencies:

```console
pip install -r requirements.txt
npm install
```

### Build the dockerfile

Make sure the Docker daemon is running.

Open a cmd on the root of the project and run the command:
```console
docker build -t javascript_blueprint .\images\base_nodejs_blueprint\
```

### Run the server

There is a docker-compose.yml file that has all the settings that make up the server. The version of Minecraft, the map it runs, the maximum number of players, if it spawns animals, npcs, and enemies, etc... which is fully customizable. You can find more information about it [here](https://containers.fan/posts/setup-minecraft-server-on-docker/). By default this uses a test map in the worlds folder and Minecraft version 1.12.

Firstly, you will neeed to create a .env file by running the following commands:

```console
echo UID=$(id -u) > .env
echo GID=$(id -g) >> .env
```

Then open the file and add also WHITELISTED_PLAYERS and OPS_PLAYERS variables to it, even if you plan to leave them blank.

After the server is deployed, you can connect to it by connecting directly to localhost:25565.

### Deploying the agents

Run deploy.py and the agents will deploy.