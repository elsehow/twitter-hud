var Twitter = require('twitter')
	 , config = require('./config.js')
	 , Kefir = require('kefir')
	 , _ = require('lodash')
   , stringifier = require("JSONStream").stringify()
	 
function write (tweet) {
  stringifier.write(tweet)
}

function writeEach (tweets) {
  _.map(tweets.statuses, write)
}

var client = new Twitter(config.twitterKeys)

//make radius into longest dimension of bbox
function longestDimension (bbox) {
  return _.max([bbox.latitude.range, bbox.longitude.range])
}

function inKm (m) {
  return m/1000.0
}

var bbox = config.boundingBox
var geocodeString = [
  bbox.centerLongitude()
  , bbox.centerLatitude()
  , inKm(longestDimension(bbox)) + 'km'
].join(',')

var tweets = Kefir.fromNodeCallback(function (callback) {
  client.get('search/tweets'
  		, { geocode: geocodeString }
  		, callback)
})

tweets.onValue(writeEach)
stringifier.pipe(process.stdout)
