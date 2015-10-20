var spawn = require('child_process').spawn
  , server = require('http').createServer()
	, CombineStreams = require('combine-stream')
	, through = require('through2')
  , JSONStream = require('JSONStream')
  , fs = require('fs')
	, es = require('event-stream')
	, Kefir = require('kefir')
  , config = require('./config.js')
  , locationFilter = require('./filterByBoundingBox.js')(config.boundingBox)


function smap (fn) {
  return es.mapSync(fn)
}

function parsedStream (s) {
	return Kefir.stream(function (emitter) {
    s.pipe(JSONStream.parse('*'))
		 .pipe(smap(emitter.emit)) 
	})
}

var query  = spawn('node', [__dirname + '/query.js'])
var stream = spawn('node', [__dirname + '/stream.js'])

var tweets = Kefir.merge([
  parsedStream(query.stdout)
  , parsedStream(stream.stdout)
])

// turn all tweets that pass through into a sliding window of 25 tweets
// this is my application state
tweets
  .filter(locationFilter)
  .slidingWindow(25)
  .onValue(writeToFile)

//  logging stuff
var stringifier = JSONStream.stringify()
stringifier .pipe(require('fs').createWriteStream('samples.json'))
function writeToFile (json) {
	process.stdout.write('x')
  stringifier.write(json)	
}
