FROM nikolaik/python-nodejs:python3.11-nodejs20-alpine	
LABEL socialcraft_agent=''

# Add Mineflayer modules
WORKDIR /agent
RUN npm install js-logger mineflayer mineflayer-pathfinder mineflayer-statemachine minecraft-data mineflayer-collectblock vec3 dotenv
RUN npm install

COPY socialcraft_handler.js/ ./socialcraft_handler.js

# Run Agent
EXPOSE 3000
CMD ["node", "main.js"]