const {mongoose} = require('../db/mongoose');
var Schema= mongoose.Schema;
/*var mongooseUniqueValidator = require('mongoose-unique-validator');*/

var schema = new Schema({
	firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  password: {type: String, required: true},
  email: { type: String, unique: true, lowercase: true, trim: true },
  albums: [{type: Schema.Types.ObjectId, ref: 'Album'}],
  artists: [{type: Schema.Types.ObjectId, ref: 'Artist'}]
});

/*schema.plugin(mongooseUniqueValidator);*/

module.exports = mongoose.model("User", schema); 


