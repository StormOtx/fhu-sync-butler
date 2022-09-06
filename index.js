// System imports
var fs = require('fs');
var path = require('path');
var logger = require('./logger');

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Subscribing to all events from the events/ folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
        logger.debug(`Registering One Time event : ${event.name}`);
		client.once(event.name, (...args) => event.execute(...args));
	} else {
        logger.debug(`Registering event listener : ${event.name}`);
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Login to Discord with your client's token
client.login(token);