module.exports = {
	name: 'channelCreate',
	once: false,
	execute
};

function execute(channel) {
    console.log("Channel create!");
    console.log(channel);
}