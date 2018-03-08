var mongoose = require('mongoose');
var Schema= mongoose.Schema; 

var schema = new Schema({
    artistsName: String,
    myRating: Number,
    albumId: Number,
    styles: [ String ],
    genres: [ String ],
    main_release_url: String,
    num_for_sale: Number,
    videos: [
        {
            duration: Number,
            embed: Boolean,
            title: String,
            description: String,
            uri: String
        }
    ],
    title: String,
    main_release: Number,
    notes: String,
    artists: [
        {
            join: String,
            name: String,
            anv: String,
            tracks: String,
            role: String,
            resource_url: String,
            id: Number
        }
    ],
    uri: String,
    versions_url: String,
    lowest_price: Number,
    year: Number,
    images: [{}],
    resource_url: String,
    tracklist: [
        {
            duration: String,
            position: String,
            type_: String,
            title: String
        }
    ],
    id: Number,
    data_quality: String
});

module.exports = mongoose.model('Album', schema);