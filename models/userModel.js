const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  userid: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: "" // You can also default to a placeholder path if needed
  }
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
