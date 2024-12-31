const { Schema, model, default: mongoose } = require("mongoose");
const Default = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});
const defaultS = mongoose.model("defaultS", Default);
module.exports = {
  defaultS,
};
