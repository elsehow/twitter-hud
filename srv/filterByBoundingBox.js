var config = require('./config.js')
  , _ = require('lodash')
	, samples = require('./samples.js')

function coordinates (tweet) {
	try {
    return tweet.coordinates.coordinates
	} catch (_) { return } 
}

function hasCoordinates (tweet) {
  if (coordinates(tweet)) 
		return tweet
}

function inside (bbox, tweet) {
  var coors = coordinates(tweet)
	if (bbox.contains(coors[0], coors[1]))
			return tweet
}

module.exports = function (boundingBox) {
  return function (tweet) {
		if (hasCoordinates(tweet)) {
  	  if (inside(boundingBox, tweet)) {
				return tweet
			}
		}
  }
}


