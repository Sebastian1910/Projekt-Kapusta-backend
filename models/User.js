const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    minlength: [2, "Username must be at least 2 characters long"],
    maxlength: [20, "Username must be at most 20 characters long"],
  },
  password: {
    type: String,
    required: [true, "Password is require"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is require"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  token: {
    type: String,
    default: null,
  },
});

UserSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10);
};

UserSchema.methods.validatePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
