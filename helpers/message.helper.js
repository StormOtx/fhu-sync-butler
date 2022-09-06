module.exports.replyToMessage = (client, message, content) => {
    client.api.channels[message.channel.id].messages.post({
        data: {
          content: content,
          message_reference: {
            message_id: message.id,
            channel_id: message.channel.id,
            guild_id: message.guild.id
          }
        }
    })
}