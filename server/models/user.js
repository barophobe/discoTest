const {mongoose} = require('../db/mongoose');

var userSchema = new mongoose.Schema({
	name: { type: String, trim: true, required: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  facebook: {
    id: String,
    email: String
  },
  google: {
    id: String,
    email: String
  }
});

module.exports = mongoose.model("User", userSchema); 


