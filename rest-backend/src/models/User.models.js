const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
});

const User = model("user", UserSchema);

module.exports = { User };
