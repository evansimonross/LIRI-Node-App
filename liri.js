require("dotenv").config();
const Spotify = require('node-spotify-api');
const Reddit = require('snoowrap');
const request = require('request');
const fs = require('fs');
const readline = require('readline');

var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);
var reddit = new Reddit(keys.reddit);

var log = function (text) { 
    fs.appendFile(
        'log.txt',
        text,
        function (error) {
            if (error) { console.error }
        }
    )
    console.log(text);
}

var run = function (args) {

    var command = "";
    for (var i = 2; i < args.length; i++) {
        if(args[i].substring(0,1)==='"'){
            args[i] = args[i].substring(1,args[i].length-1);
        }
        command += args[i];
        if (i < args.length - 1) {
            command += " ";
        }
        else{
            command += "\n";
        }
    }

    fs.appendFile(
        'log.txt',
        'node liri.js ' + command,
        function (error) {
            if (error) { console.error }
        }
    )

    if (args[2] === "help") {
        var text = "";
        text = 'Here are the currently available commands:\n\n';
        text += 'node liri.js spotify-this-song "<song name here>"\n';
        text += '--> Searches Spotify for a song with that title.\n\n';
        text += 'node liri.js my-comments #\n';
        text += '--> Searches Reddit for user comments.\n';
        text += '----> An integer argument is optional. If one is supplied, it sets the maximum number of results. It is 20 by default.\n\n';
        text += 'node liri.js movie-this "<movie name here>"\n';
        text += '--> Searches OMDB for a movie with that title.\n\n';
        text += 'node liri.js do-what-it-says\n';
        text += '--> Reads a list of commands from random.txt and executes them all... Not necessarily in order, though.\n\n';
        text += 'node liri.js help\n';
        text += '--> Provides a list of available options. But you already knew that ;)\n\n';
        text += 'node liri.js clear-log\n';
        text += '--> Erases the log of all its contents. Make sure you have a backup if you need it!\n\n';
        log(text);
    }

    else if (args[2] === "spotify-this-song") {
        spotify
            .search({ type: 'track', query: args[3] })
            .then((response) => {
                let track = response.tracks.items[0];
                var text = "";
                text = 'Track: ' + track.name + '\n';
                text += 'Artist: ' + track.artists[0].name + '\n';
                text += 'Album: ' + track.album.name + '\n';
                text += track.preview_url + '\n\n';
                log(text);
            })
            .catch(function (err) {
                var text = err;
                log(text);
            });

    }

    else if (args[2] === "my-comments") {
        reddit.getUser(reddit.username).getComments().then(function (res) {
            var numberToDisplay = parseInt(args[3]) || 20;
            if (numberToDisplay > res.length || numberToDisplay < 0) { numberToDisplay = res.length; }
            var text = "";
            for (var i = 0; i < numberToDisplay; i++) {
                text += res[i].body + '\n';
                text += new Date(new Date(parseInt(res[i].created_utc) * 1000) + ' UTC') + '\n\n';
            }
            log(text);
        });
    }

    else if (args[2] === "movie-this") {
        request("https://www.omdbapi.com/?t=" + args[3] + "&apikey=" + keys.omdb.key + "&r=json", (err, res, body) => {
            var text = "";
            if (!err && res.statusCode === 200) {
                let movie = JSON.parse(body)
                text += movie.Title + ' (' + movie.Rated + ')\n';
                text += movie.Year + ' - ' + movie.Country + ' (' + movie.Language + ')\n\n';
                text += movie.Plot + '\n\n';
                text += "Starring...\n";
                movie.Actors.split(', ').forEach(function (actor) {
                    text += '--> ' + actor + '\n';
                });
                text += "\nThe critics say...\n";
                movie.Ratings.forEach(function (rating) {
                    text += '--> ' + rating.Source + ": " + rating.Value + '\n';
                })
                text += '\n';
            }
            else{
                text + "ERROR: OMDB could not be reached."
            }
            log(text);
        })
    }

    else if (args[2] === "do-what-it-says") {
        const rl = readline.createInterface({
            input: fs.createReadStream('random.txt')
        });
        rl.on('line', (line) => {
            var newArgs = [];
            newArgs.push(args[0]);
            newArgs.push(args[1]);
            var index = line.indexOf(" ");
            if (index != -1) {
                newArgs.push(line.substring(0, index));
                newArgs.push(line.substring(index+1, line.length));
            }
            else {
                newArgs.push(line);
            }
            console.log(line);
            run(newArgs);
        });
    }

    else if(args[2] === "clear-log"){
        fs.writeFile(
            'log.txt',
            "",
            function (error) {
                if (error) { console.error }
            }
        )
    }

    else{
        text = "Error: Command Not Recognized\n\n";
        log(text);
    }
}

run(process.argv);