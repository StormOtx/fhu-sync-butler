module.exports = {
	name: 'messageCreate',
	once: false,
	execute
};

const logger = require("../logger");

const { PresetsChannelId } = require('../config.json');
const { addPreset } = require("../controllers/message.controller");
const { replyToMessage } = require("../helpers/message.helper");

async function execute(message, client) {
    // Checks if received message belongs to the presets channel
    if (message.channelId == PresetsChannelId) {
        // Message must contain at least one attachment (.fhp file)
        if (message.attachments.size > 0) {
            logger.debug("Got a message from presets channel with attachment");
            logger.debug(message);
            try {
                await addPreset(message);
                replyToMessage(client, message, "Your preset has been added successfully!");
            } catch (e) {
                replyToMessage(client, message, `Something went wrong : ${e}`);
            }
        }
    }
}