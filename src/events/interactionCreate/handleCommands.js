const { Client, CommandInteraction } = require("discord.js");
const { devs, MainServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @returns
 */
module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand())
    return;

  const localCommands = getLocalCommands();
  const OWNERID = devs[0];
  const isOwner = interaction.member.id === OWNERID;

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;
    if (interaction.user.id !== OWNERID) {
      if (commandObject.devOnly) {
        if (!devs.includes(interaction.member.id)) {
          interaction.reply({
            content: "❌Only developers are allowed to run this command.",
            ephemeral: true,
          });
          return;
        }
      }

      if (commandObject.MainOnly) {
        if (!(interaction.guild.id === MainServer)) {
          interaction.reply({
            content: "❌This Command Can't Run here.",
            ephemeral: true,
          });
          return;
        }
      }

      if (interaction.member && commandObject.permissionsRequired?.length) {
        for (const permission of commandObject.permissionsRequired) {
          if (!interaction.member.permissions.has(permission)) {
            interaction.reply({
              content: "Not enough permissions.",
              ephemeral: true,
            });
            return;
          }
        }
      }
      if (interaction.member && commandObject.Roles?.length) {
        const hasRequiredRole = commandObject.Roles.some((role) =>
          interaction.member.roles.cache.has(role)
        );

        if (!hasRequiredRole && !isOwner) {
          interaction.reply({
            content: "Not enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }

      if (commandObject.botPermissions?.length) {
        for (const permission of commandObject.botPermissions) {
          const bot = interaction.guild.members.me;

          if (!bot.permissions.has(permission)) {
            interaction.reply({
              content:
                "I don't have enough permissions to execute this command.",
              ephemeral: true,
            });
            return;
          }
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(
      `There was an error running the command ${interaction.commandName} in handle:`,
      error
    );
  }
};
