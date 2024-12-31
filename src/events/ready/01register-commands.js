const areCommandsDifferrent = require("../../utils/areCommandsDifferrent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const { ContextMenuCommandBuilder } = require("discord.js");

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();

    const registerCommandsInGuild = async (guild) => {
      try {
        const applicationCommands = await getApplicationCommands(
          client,
          guild.id
        );

        for (const localCommand of localCommands) {
          const { name, description, options, type, global } = localCommand;
          if (global) continue;
          if (!name || name === "") continue;
          const existingCommand = await applicationCommands.cache.find(
            (cmd) => cmd.name === name
          );
          if (type === "context") {
            const contextCommand = new ContextMenuCommandBuilder()
              .setName(name)
              .setType(description);
            if (existingCommand) {
              if (localCommand.deleted) {
                await applicationCommands.delete(existingCommand.id);
                console.log(
                  `🗑️ Deleted Command "${name}" in guild "${guild.name}".`
                );
                continue;
              }
            } else {
              if (localCommand.deleted) {
                console.log(
                  `Skipping "${name}" in guild "${guild.name}" as it has been deleted.`
                );
                continue;
              }

              await applicationCommands.create(contextCommand);
              console.log(
                `👌The Command "${name}" was Successfully Registred in guild "${guild.name}"`
              );
            }

            continue;
          }
          if (existingCommand) {
            if (localCommand.deleted) {
              await applicationCommands.delete(existingCommand.id);
              console.log(
                `🗑️ Deleted Command "${name}" in guild "${guild.name}".`
              );
              continue;
            }
            if (areCommandsDifferrent(existingCommand, localCommand)) {
              await applicationCommands.edit(existingCommand.id, {
                description,
                options,
              });
              console.log(
                `🔁The Command "${name}" Has Been Edited in guild "${guild.name}".`
              );
            }
          } else {
            if (localCommand.deleted) {
              console.log(
                `Skipping "${name}" in guild "${guild.name}" as it has been deleted.`
              );
              continue;
            }

            await applicationCommands.create({
              name,
              description,
              options,
            });
            console.log(
              `👌The Command "${name}" was Successfully Registred in guild "${guild.name}"`
            );
          }
        }
      } catch (error) {
        console.log(`Error processing guild "${guild.name}":`, error);
      }
    };

    client.guilds.cache.forEach(registerCommandsInGuild);

    client.on("guildCreate", (guild) => {
      console.log(`➡️ Bot joined a new guild: ${guild.name}`);
      registerCommandsInGuild(guild);
    });
  } catch (error) {
    console.log(`There was an error in reg: ${error}`);
  }
};
