const {
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "ping",
  description: "pong!!",
  // devOnly: true,
  // MainOnly: true,
  // options: Object[],
  // Roles: Object[],
  // global: false
  deleted: false,
  permissionsRequired: [PermissionFlagsBits.UseApplicationCommands],
  botPermissions: [PermissionFlagsBits.UseApplicationCommands],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  callback: (client, interaction) => {
    interaction.reply({
      content: `Pong!! \`${client.ws.ping}ms\``,
      ephemeral: true,
    });
  },
};
