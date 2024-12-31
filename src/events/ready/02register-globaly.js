const areCommandsDifferent = require("../../utils/areCommandsDifferrent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();

    // Function to register commands globally
    const registerGlobalCommands = async () => {
      try {
        const applicationCommands = await getApplicationCommands(client);

        for (const localCommand of localCommands) {
          const { name, description, options, global } = localCommand;
          const existingCommand = await applicationCommands.cache.find(
            (cmd) => cmd.name === name
          );
          if (global) {
            if (existingCommand) {
              if (localCommand.deleted) {
                await applicationCommands.delete(existingCommand.id);
                console.log(`🗑️ Deleted Command "${name}".`);
                continue;
              }
              if (areCommandsDifferent(existingCommand, localCommand)) {
                await applicationCommands.edit(existingCommand.id, {
                  description,
                  options,
                });
                console.log(`🔁The Command "${name}" Has Been Edited.`);
              }
            } else {
              if (localCommand.deleted) {
                console.log(`Skipping "${name}" as it has been deleted.`);
                continue;
              }

              await applicationCommands.create({
                name,
                description,
                options,
              });
              console.log(
                `👌The Command "${name}" was Successfully Registered Globally.`
              );
            }
          }
        }
      } catch (error) {
        console.log(`Error registering global commands: ${error}`);
      }
    };

    // Register global commands on bot startup
    await registerGlobalCommands();

    // Listen for the 'ready' event to ensure all guilds are loaded
    client.once("ready", () => {
      console.log("Bot is ready, registering global commands...");
      registerGlobalCommands();
    });
  } catch (error) {
    console.log(`There was an error in registration: ${error}`);
  }
};
