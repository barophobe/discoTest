var mongoose = require('mongoose');
var Schema= mongoose.Schema; 

var schema = new Schema({
 artistsName: String,
  namevariations: [ String ],
  profile: String,
  releases_url: String,
  resource_url: String,
  uri: String,
  urls: [ String ],
  data_quality: String,
  id: Number,
  images: [{}],
  members: [
    {
      active: Boolean,
      id: Number,
      name: String,
      resource_url: String
    }
  ]
});

module.exports = mongoose.model('Artist', schema);


