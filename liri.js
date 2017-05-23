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

// songs and movie search have a default value if left blank.  If the user inputs a value, the default is updated to the input
var convert = function() {
  if (input !== undefined) {
    defaultMovie = input;
    defaultSong = input;
  } else {
  return false;
  }
}

/*TODO: 

Update write to log to append cmds and output on new lines
Rotten tomatoes link?

*/

// writes to the log file
var log = function(data) {

  fs.appendFile("./challengelog.txt", cmd + " " + input + "\\n");
  fs.appendFile("./challengelog.txt", JSON.stringify(data, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The log has been updated");
  
  });
}

// will retreive Harry Tasker's tweets

var myTweets = function() {
  var client = new twitter(keys);
  var params = { screen_name: 'HarryTasker8', count: 20 };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    var data = [];
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
      data.push([i + 1] + ": " + tweets[i].created_at + ": " + tweets[i].text);
    }
    console.log(JSON.stringify(data, null, 2));
    log(data);
    }

  });
};

// searches spotify for song information and displays the first result
var spotSong = function() {

  spotify.search({ type: 'track', query: defaultSong }, function(err, data) {
    
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }

    var firstResult = data.tracks.items[0]; 
    var data = [];

    if (firstResult !== undefined) {

      for (i = 0; i < 1; i++) {
        data.push({
          'Artist ': firstResult.album.artists[0].name,
          'Song Name ': firstResult.name,
          'Preview ': firstResult.preview_url,
          'album ': firstResult.album.name
        })
      }
      console.log(JSON.stringify(data, null, 2));
      log(data);
    } else {
      console.log("Please try again, no results were found");
    }
  
  });

}

// finds movie information on OMDP
var findMovie = function() {

    request("http://www.omdbapi.com/?t=" + defaultMovie + "&plot=full&r=json&apikey=40df9e07", function(error, response, data) {

        if ( error ) {
        console.log('Error occurred: ' + error);
        return;
      }

      var info = JSON.parse(data);
      var movieData = [];

      if (info.Title !== undefined) {
        movieData.push({
          "Title ": info.Title,
          "Released ": info.Released,
          "IMDB Rating ": info.imdbRating,
          "Country ": info.Country,
          "Language ": info.Language,
          "Plot ": info.Plot,
          "Actors": info.Actors
        })
        console.log(JSON.stringify(movieData, null, 2));
        log(movieData);     
      } else {
        console.log("Please try again, no results were found");
      }

    });

}

// Does what random.txt says to do
var justDoIt = function() {
  fs.readFile("./random.txt", 'utf8', function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
  dataArr = data.split(",");
  defaultSong = dataArr[1];
  spotSong();

  })
}

// help, called on null inputs and incorrect cmds
var displayHelp = function() {

    console.log("How to use Liri:");
    console.log("----------------------------------------------");
    console.log("To display Harry Tasker's last 20 tweets: <node liri.js my-tweets>");
    console.log("----------------------------------------------");
    console.log("To search for Spotify song information: <node liri.js spotify-this-song 'song name'> -- 'quotes around song name'");
    console.log("----------------------------------------------");
    console.log("To search for OMDBmovie information: <node liri.js movie-this 'movie title'> -- 'quotes around movie title'")
    console.log("----------------------------------------------");
    console.log("Feeling crazy?  Do something random...at least the first time: <node.js liri.js do-what-it-says> -- Try to not have too much fun with this one")

}

// cases to capture inputs
if (cmd === undefined) {
  cmd = "help";
}

switch (cmd.toLocaleLowerCase()) {

  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    convert(defaultSong);
    spotSong();
    break;

  case "movie-this":
    convert(defaultMovie);
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
