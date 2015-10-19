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

//TODO make radius into longest dimension of bbox

var bbox = config.boundingBox
var myGeo = [bbox.centerLongitude(), bbox.centerLatitude(), '5mi'].join(',')

var tweets = Kefir.fromNodeCallback(function (callback) {
  client.get('search/tweets'
  		, {geocode: myGeo}
  		, callback)
})

tweets.onValue(writeEach)
stringifier.pipe(process.stdout)
