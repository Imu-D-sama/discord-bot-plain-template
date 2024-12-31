const { Client, Message } = require("discord.js");

module.exports = {
  name: "ping",
  // roles: [],
  // open: false,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   */
  callback: async (client, message) => {
    if (message.content !== `${client.config.prefix}${module.exports.name}`)
      return;
    await message.reply({
      content: `Pong!! \`${client.ws.ping}ms\``,
      allowedMentions: { repliedUser: false },
    });
  },
};
