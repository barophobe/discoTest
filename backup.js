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

var encodedArtist = encodeURIComponent(argv.q);

const artParam = 'artist';

var db = new Discogs('Musictrackr/1.0',{
	consumerKey: 'lqVfJpTFYAhTVWdeImof', 
	consumerSecret: 'HDkIWQuwiOzDyFhvwfhVwfYARtFrMjNo'
})
.database();

/*db.search(encodedArtist,artParam, function(err, data){
	var slim = data.results;
	console.log(JSON.stringify(slim, undefined, 4));
	});
*/




db.search(encodedArtist,artParam, function(err, data){
	var results = data.results;

	var out = results.filter(function(result) {
    return result.type === 'artist'; 
})
	console.log(JSON.stringify(out, undefined, 4));
	});
/*var doubled = numbers.map(function(number) {
   return number * 2; // return is very important in mapping helper function, if no return values are null
 });
	*/

	/*db.search(encodedArtist,artParam, function(err, data){
	var slim = data.results;

	var fragra = slim.map(function(sing) {
   return sing.type == 'artist'; 
 })

	console.log(JSON.stringify(fragra, undefined, 4));
	});*/ //might work with some tweaking
