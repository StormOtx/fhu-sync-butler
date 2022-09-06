const path = require('path');
const https = require('https');
const { createPresetDto } = require("../dto/createPreset.dto");
const { checkIfValidPreset } = require("../helpers/preset.helper");
const { addNewPreset } = require("../repositories/preset.repository");
const logger = require("../logger");

module.exports.addPreset = async (message) => {
    var dto = createPresetDto();

    // Loop through all attachments
    for (let value of message.attachments.values()) {
        // Attachment is preset
        if (path.extname(value.name) === ".fhp") {

            logger.debug(`Found preset file ${value.name}`);

            // Retrieves the first chunk of the preset then closes connection
            var headerDownload = new Promise((resolve, reject) => {
                var header = undefined;

                logger.debug(`Starting file download at ${value.attachment}`);

                https.get(value.attachment, (res) => {
                    res.on('data', (chunk) => {
                        logger.debug(`Got a chunk of data. Closing request`);
                        header = chunk;
                        res.emit('end');
                        res.removeAllListeners('data');
                    })
                    .on('end', () => {
                        resolve(header);
                    })
                });
            });

            const binaryHeader = await headerDownload;

            logger.debug(`Verifying file header`);

            // If the header doesn't match magic bytes, abort
            if (!checkIfValidPreset(binaryHeader)) {
                logger.error(`Mismatched header for preset file. Aborting : ${binaryHeader}`);
                throw "File isn't a preset or is corrupted";
            }

            logger.debug(`Preset file is nominal`);

            dto["name"] = value.name;
            dto["download_link"] = value.attachment;
            dto["size"] = value.size;
        }
        // Attachment is a preview picture of the preset. Must be totally ordered
        else if (["image/png", "image/jpeg"].includes(value.contentType)) {
            logger.debug(`Got an image. Attachment : ${value.attachment}`);

            if (!dto["thumbnail"])
                dto["thumbnail"] = value.attachment;
            else if (!dto["preview_1"])
                dto["preview_1"] = value.attachment;
            else
                dto["preview_2"] = value.attachment;
        } else {
            logger.error(`Unsupported file type. Skipping : ${value.name}, ${value.attachment}`);

            throw "Unsupported preview picture. Must be either png or jpeg";
        }
    }

    dto["author_id"] = message.author.id;

    // Saves preset info to the database

    try {
        logger.debug(`Adding preset to database`);
        await addNewPreset(dto);
        logger.info(`Successfully added new preset '${dto["name"]}' to database`);

        return true;
    } catch (e) {
        logger.error(`An error occured when adding new preset to the database. Reason : ${e}`)
        if (e.toString().includes("SequelizeUniqueConstraintError")) {
            throw "Preset is already part of the collection";
        } else {
            throw "An error occured while adding preset to database";
        }
    }

}