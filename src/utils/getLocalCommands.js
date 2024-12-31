const path = require("path");
const getAllfiles = require("./getAllFiles");

module.exports = (exception = []) => {
  let localCommands = [];

  const commandCategories = getAllfiles(
    // eslint-disable-next-line no-undef
    path.join(__dirname, "..", "commands"),
    true
  );

  for (const commandCategory of commandCategories) {
    const commandFiles = getAllfiles(commandCategory);

    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);

      if (exception.includes(commandObject.name)) {
        continue;
      }

      localCommands.push(commandObject);
    }
  }

  return localCommands;
};
