require('dotenv').config();
let keys = require('./keys.js');
let fs = require('fs')
let request = require('request')
let Spotify = require('node-spotify-api');
let  spotify = new Spotify(keys.spotify);
let [node, liri, command, ...input] = process.argv


if (command === 'spotify-this-song') {
  if(input[0] === undefined) {input = 'The-Sign+Ace-of-Base'}
    spotify.search({ type: 'track', query: input, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        let artist = JSON.stringify(data.tracks.items[0].artists[0].name)
        let track_name = JSON.stringify(data.tracks.items[0].name)
        let preview = JSON.stringify(data.tracks.items[0].preview_url)
        let album = JSON.stringify(data.tracks.items[0].album.name)
        let final_data = '\r\nArtist: '+artist+'\r\nSong Title: '+track_name+'\r\nSong Preview: '+preview+'\r\nAlbum Title: '+album

        fs.appendFile('./log.txt', '\r\n'+command+':'+input+final_data , (err) => {
            if (err) throw err;
          });
          console.log(final_data)
    })
}

if (command === 'movie-this') {
  if(input[0] === undefined) {input = 'Mr. Nobody'}
    request('http://www.omdbapi.com/?apikey='+keys.omdb.key+'&t='+input+'&r=json&plot=short&', function (error, response, body) {
      if (error) {console.log('error:', error)} 
      let movie_data = JSON.parse(body)
      let final_data = '\r\nTitle: '+movie_data.Title+'\r\nRelease Date: '+movie_data.Year+'\r\nIMDB Rating: '+movie_data.imdbRating+'\r\n'+movie_data.Ratings[1].Source+': '+movie_data.Ratings[1].Value+'\r\nCountry Produced: '+movie_data.Production+'\r\nLanguage(s): '+movie_data.Language+'\r\nPlot: '+movie_data.Plot+'\r\nActors: '+movie_data.Actors
      
    fs.appendFile('./log.txt', '\r\n'+command+':'+input+final_data, (err) => {
      if (err) throw err;
      });
      console.log(final_data)
      });
}
