module.exports = {
	name: 'guildCreate',
	once: false,
	execute
};

const { ServerWhitelist } = require('../config.json');

async function execute(guild) {
    if (!ServerWhitelist.includes(guild.id)) {
        console.log(`Unknown server id : ${guild.id}. Leaving server...`)
        guild.leave();
    }

    console.log(`Joined guild : ${guild}`);
}