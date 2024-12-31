const {
  Client,
  UserContextMenuCommandInteraction,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "Example/Context",
  description: ApplicationCommandType.User,
  type: "context",
  deleted: false,
  Roles: ["123456789123456789"],
  /**
   *
   * @param {Client} client
   * @param {UserContextMenuCommandInteraction} interaction
   */
  callback: async (client, interaction) => {
    try {
      if (interaction) return;
    } catch (error) {
      if (!interaction.replied) {
        interaction.reply({
          content: "error",
          ephemeral: true,
        });
      }
      console.log("Error in ExampleContext command:", error);
    }
  },
};
