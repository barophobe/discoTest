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

db.search(encodedArtist,artParam, function(err, data){
	var outPut = data.results.filter(function(result) {
    return result.type === 'artist'; 
	})
	console.log(JSON.stringify(outPut, undefined, 4));
});
