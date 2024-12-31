const { Client, ActivityType } = require("discord.js");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  client.user.setActivity({
    name: "Imu_sama",
    type: ActivityType.Watching,
  });
};
