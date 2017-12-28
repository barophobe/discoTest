const yargs = require('yargs');
const argv = yargs
.options({
	q: {
		demand: true,
		alias: 'query',
		describe: 'database query',
		string: true	
	}
})
.help()
.alias('help', 'h')
.argv;

var Discogs = require('disconnect').Client;

var encodedArtist = argv.q;

const artParam = 'artist';

var db = new Discogs('Musictrackr/1.0',{
	consumerKey: 'lqVfJpTFYAhTVWdeImof', 
	consumerSecret: 'HDkIWQuwiOzDyFhvwfhVwfYARtFrMjNo'
})
.database();

/*db.search(encodedArtist,artParam, function(err, data){
	var outPut = data.results.filter(function(result) {
    return result.type === 'release'
     && product.quantity > 0 ; 
	})
	console.log(JSON.stringify(outPut, undefined, 4));
});*/

//79023
/*db.getArtist(59792)
    .then(function(artist){ 
        return db.getArtistReleases(59792);
    })
    .then(function(release){
        console.log(release.name);
    });*/







    db.getArtistReleases(59792)
    .then(function(release){ 
        return db.getArtist(release.artists[0].id);
    })
    .then(function(artist){
        console.log(artist.name);
    });