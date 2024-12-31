/* eslint-disable no-undef */
const path = require("path");
const fs = require("fs");
const { Client } = require("discord.js");
const getAllFiles = require("../utils/getAllFiles");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  const eventsPath = path.join(__dirname, "..", "events");

  const chatCommandsPath = path.join(__dirname, "..", "chatCommands");

  const logsPath = path.join(__dirname, "..", "logs");

  if (fs.existsSync(eventsPath)) {
    const eventFolders = getAllFiles(eventsPath, true);

    for (const eventFolder of eventFolders) {
      const eventFiles = getAllFiles(eventFolder);
      eventFiles.sort((a, b) => a > b);

      const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

      client.on(eventName, async (arg, arg2) => {
        for (const eventFile of eventFiles) {
          const eventFunction = require(eventFile);
          await eventFunction(client, arg, arg2);
        }
      });
    }
  }
  if (fs.existsSync(logsPath)) {
    const logFiles = getAllFiles(logsPath, false);
    for (const logFile of logFiles) {
      const logEvent = logFile
        .replace(/\\/g, "/")
        .split("/")
        .pop()
        .replace(".js", "");
      client.on(logEvent, async (arg, arg2) => {
        const eventFunction = require(logFile);
        await eventFunction(client, arg, arg2);
      });
    }
  }
  if (fs.existsSync(chatCommandsPath)) {
    const chatCommandsFiles = getAllFiles(chatCommandsPath, false);
    client.on("messageCreate", async (message) => {
      for (const chatCommandsFile of chatCommandsFiles) {
        try {
          const eventFunction = require(chatCommandsFile);
          if (!message.inGuild()) continue;
          if (eventFunction.bypass) {
            await eventFunction.bypass(client, message);
          }
          if (message.author.bot) continue;
          const hasRole = eventFunction.roles
            ? eventFunction.roles.some((r) => message.member.roles.cache.has(r))
            : false;
          const isAuthor = message.author.id === "584506941754310669";
          if (!hasRole && !isAuthor) continue;

          message.content = message.content.replace(/\s+/g, " ").trim();
          await eventFunction.callback(client, message);
        } catch (error) {
          console.log(
            `Error in a chat command: ${chatCommandsFile.split("\\").pop()}:`,
            error
          );
        }
      }
    });
  }
};
