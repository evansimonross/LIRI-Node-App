require("dotenv").config();
const Spotify = require('node-spotify-api');
const Reddit = require('snoowrap');
const request = require('request');

var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);
var reddit = new Reddit(keys.reddit);

if (process.argv[2] === "help") {
    console.log('Here are the currently available commands:')
    console.log();
    console.log('node liri.js spotify-this-song "<song name here>"');
    console.log('--> Searches Spotify for a song with that title.');
    console.log();
    console.log('node liri.js my-comments #');
    console.log('--> Searches Reddit for user comments.');
    console.log('----> An integer argument is optional. If one is supplied, it sets the maximum number of results. It is 20 by default.')
    console.log();
    console.log('node liri.js movie-this "<movie name here>"');
    console.log('--> Searches OMDB for a movie with that title.');
    console.log();

    console.log('node liri.js help');
    console.log('--> Provides a list of available options. But you already knew that ;)');
}
else if (process.argv[2] === "spotify-this-song") {
    spotify
        .search({ type: 'track', query: process.argv[3] })
        .then(function (response) {
            let track = response.tracks.items[0];
            console.log();
            console.log('Track: ' + track.name);
            console.log('Artist: ' + track.artists[0].name);
            console.log('Album: ' + track.album.name);
            console.log(track.href);
            console.log();
        })
        .catch(function (err) {
            console.log(err);
        });
}

else if (process.argv[2] === "my-comments") {
    reddit.getUser(reddit.username).getComments().then(function (res) {
        var numberToDisplay = parseInt(process.argv[3]) || 20;
        if (numberToDisplay > res.length || numberToDisplay < 0 ) { numberToDisplay = res.length; }
        for(var i=0; i<numberToDisplay; i++){
            console.log();
            console.log(res[i].body);
            console.log(new Date(new Date(parseInt(res[i].created_utc)*1000) + ' UTC'));
        }
    });
}

else if (process.argv[2] === "movie-this") {
    request("https://www.omdbapi.com/?t=" + process.argv[3] + "&apikey=" + keys.omdb.key + "&r=json", function(err, res, body) {
	if(!err && res.statusCode === 200) {
        let movie = JSON.parse(body)
        console.log();
		console.log(movie.Title + ' (' + movie.Rated + ')');
        console.log(movie.Year + ' - ' + movie.Country + ' (' + movie.Language + ')');
        console.log();
        console.log(movie.Plot);
        console.log();
        console.log("Starring...");
        movie.Actors.split(', ').forEach(function(actor){
            console.log('--> ' + actor);
        });
        console.log();
		console.log("The critics say...");
		movie.Ratings.forEach(function(rating){
			console.log('--> ' + rating.Source + ": " + rating.Value)
		})
	}
})
}