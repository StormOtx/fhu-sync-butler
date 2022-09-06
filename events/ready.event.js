module.exports = {
	name: 'ready',
	once: true,
	execute
};

const logger = require("../logger");
const presetRepository = require("../repositories/preset.repository");

async function execute(client) {
    logger.info(`Bot is ready! Logged in as ${client.user.tag}`);
	presetRepository.syncModel();
	logger.debug(`Synced DB preset model`);
}