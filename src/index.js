/* eslint-disable no-undef */
require("dotenv").config(); //call the .evn file
const { Client, IntentsBitField, Partials } = require("discord.js");
const mongoose = require("mongoose");
const jsoC = require("../config.json");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
  partials: [Partials.Reaction, Partials.Message],
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildIntegrations,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildWebhooks,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
}); //premisions

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to DB.");
    client.config = {};
    Object.entries(jsoC).forEach(([k, v]) => {
      client.config[k] = v;
    });
    console.log("prefix set to", client.config.prefix);
    await eventHandler(client);
    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
