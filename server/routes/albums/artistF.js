const request = require('request');

var artistRecords = (artist, callback) => {
    var encodedArtist = encodeURIComponent(artist);
    var urlDis = 'https://api.discogs.com/database/search?type=master&format=album&country=us&artist='+ encodedArtist +'&key='+process.env.Key+'&secret='+process.env.Secret;
    request({  
      url: urlDis,
      headers: {'User-Agent': 'Musictrackr/1.0'},
      json: true
    }, (error, response, body) => {
       if (error) {
          callback('Unable to connect to Discogs servers.');
        } else if (response.statusCode === '500') {
          callback('Query time exceeded. Please try a simpler query');
        }  
        callback(undefined, {albums: body.results});
          
      });
};

module.exports.artistRecords = artistRecords;

