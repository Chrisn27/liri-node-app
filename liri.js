var fs = require('fs'); 
var tweetKeys = require("./keys.js");
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

var keys = tweetKeys.twitterKeys;
var cmd = process.argv[2];
var input = process.argv[3];
var defaultSong = "The Sign Ace of Base";
var defaultMovie = "Mr. Nobody";

var convert = function() {
  if (input !== undefined) {
    defaultMovie = input;
    defaultSong = input;
  } else {
  return false;
  }
}

// will retreive Harry Tasker's tweets
// console.log(JSON.stringify(data, null, 2));

/*
TODO:

Fix do it script to find right song
add default song to find on spotSong
add default to omdb search
*/

var myTweets = function() {
  var client = new twitter(keys);
  var params = { screen_name: 'HarryTasker8', count: 20 };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
      console.log([i + 1] + ": " + tweets[i].created_at + ": " + tweets[i].text);
      }
    }

  });
};

var spotSong = function() {

  spotify.search({ type: 'track', query: defaultSong }, function(err, data) {
    
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }

    var firstResult = data.tracks.items[0];
    
    //console.log(JSON.stringify(firstResult, null, 2));
  
    if (firstResult !== undefined) {
      console.log("Artist: " + firstResult.album.artists[0].name);
      console.log("Song Name: " + firstResult.name);
      console.log("Preview: " + firstResult.preview_url);
      console.log("Album: " + firstResult.album.name);
    } else {
      console.log("Please try again, no results were found");
    }
  
  });

}

var findMovie = function() {

    request("http://www.omdbapi.com/?t=" + defaultMovie + "&plot=full&r=json&apikey=40df9e07", function(error, response, data) {

        if ( error ) {
        console.log('Error occurred: ' + error);
        return;
      }

      var info = JSON.parse(data);
      //console.log(info);

      if (info.Title !== undefined) {
        console.log("Title: " + info.Title);
        console.log("Released: " + info.Released);
        console.log("IMDB Rating: " + info.imdbRating);
        console.log("Country: " + info.Country);
        console.log("Language: " + info.Language);
        console.log("Plot: " + info.Plot);
        console.log("Actors: " + info.Actors);
        //console.log("Title: " + info.Title);
      } else {
        console.log("Please try again, no results were found");
      }


    });

}

var justDoIt = function() {
  fs.readFile("./random.txt", 'utf8', function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
  dataArr = data.split(",");
  var removeQuotes = dataArr[1];
  songName = removeQuotes.replace(/["]+/g, "");
  console.log(songName);
  spotSong(dataArr[0], songName);
  //spotSong("'" + songName + "'");
  })
}

var displayHelp = function() {

    console.log("To display Harry Tasker's last 20 tweets: <node liri.js my-tweets>");
    console.log("----------------------------------------------");
    console.log("To search for Spotify song information: <node liri.js spotify-this-song 'song name'> -- 'quotes around song name'");
    console.log("----------------------------------------------");
    console.log("To search for OMDBmovie information: <node liri.js movie-this 'movie title'> -- 'quotes around movie title'")
    console.log("----------------------------------------------");
    console.log("Feeling crazy?  Do something random...at least the first time: <node.js liri.js do-what-it-says> -- Try to not have too much fun with this one")

}

// cases to capture inputs

switch (cmd.toLocaleLowerCase()) {

  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    convert();
    spotSong();
    break;

  case "movie-this":
    convert();
    findMovie();
    break;

  case "do-what-it-says":
    justDoIt();
    break;

  case "help":
    displayHelp();
    break;

  default: 
    console.log("Type help for information on how to use Liri")
}
