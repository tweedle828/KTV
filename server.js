var url = require('url'),
    fs = require('fs'),
    querystring = require('querystring'),
    express = require('express'),
	port = 8080,
	mongodb = require('mongodb'),
	xssfilters = require('xss-filters'),
	bodyParser = require('body-parser'),
	glob = require("glob"),
	escapeStringRegexp = require('escape-string-regexp');

//var mongoURL = "mongodb://mongodb:27017/songs"
var mongoURL = "mongodb://readonly:readonly@ds127872.mlab.com:27872/heroku_0kfm3lp6"
var app = express();

app.use(express.static('webpage/index'))
app.use(express.static('webpage/submit'))
app.use(express.static('webpage/song'))
app.use(express.static('webpage/treesearch'))
app.use(express.static('songs'))
app.use(express.static('favicons'))
app.use(express.static('dist'))
app.use(express.static('images'))

//for post requests
app.use(bodyParser.json());

var server = app.listen(process.env.PORT || port, function() {
    console.log('Listening on port %s!', server.address().port)
})
app.get('/treefind', function(req,res){
	res.sendFile(__dirname + '/webpage/treesearch/treesearch.html')
})

app.get('/submit', function(req,res){
	res.sendFile(__dirname + '/webpage/submit/index.html')
})
app.get('/getSong', function (req, res){
	var id = xssfilters.inHTMLData(req.query.id); //just in case they send me some  garbage ID
	res.writeHead(200, {'Content-type': 'application/json'});
	var lyrics = {};
	var files = ['pinyin.txt',  'cn.txt', 'eng.txt', 'times.txt'];
	files.forEach(function(item){
		try{
			
			var files = glob.sync('songs/'+ id + '*/' + id + ' ' + item)
			console.log(files)
			lyrics[item] = fs.readFileSync(files[0]).toString().split("\n");	
		 	
		}
		catch (err){
			console.log(err)
			lyrics[item] = "Error finding file";
		}

	})
	glob('songs/' + id + '*/*.mp3', function(err, files){
		if(err){
			lyrics['songFile'] = "mp3 file not found"
			throw err
		}
		else{
			lyrics['songFile'] = files[0].split("songs/")[1]
		}

		res.end(JSON.stringify(lyrics, 'utf-8'));
	})



});

app.get('/song', function (req, res){
	var id = xssfilters.inHTMLData(req.query.id); //just in case they send me some  garbage ID
	// res.writeHead(200, {'Content-type': 'application/json'});
	var lyrics = {};
	var files = ['pinyin.txt',  'cn.txt', 'eng.txt', 'times.txt'];
	files.forEach(function(item){
		try{
			
			var files = glob.sync('songs/'+ id + '*/' + id + ' ' + item)
			console.log(files)
			lyrics[item] = fs.readFileSync(files[0]).toString().split("\n");	
		 	
		}
		catch (err){
			console.log(err)
			lyrics[item] = "Error finding file";
		}

	})
	glob('songs/' + id + '*/*.mp3', function(err, files){
		if(err){
			lyrics['songFile'] = "mp3 file not found"
			throw err
		}
		else{
			lyrics['songFile'] = files[0].split("songs/")[1]
		}



	})
		// lyrics
	res.sendFile(__dirname + '/webpage/song/index.html')

	
	// var MongoClient = mongodb.MongoClient;
	// var url = mongoURL
	// MongoClient.connect(url, function(err, seed){
	// 	if(err)
	// 		console.log('unable to connect to server', err);
	// 	else{
	// 		console.log('connection established');
	// 		var collection = seed.collection('songs');
	// 		var query = {"file_name" : id.toString()}
	// 		try{
	// 			collection.findOne(query, function(err, songData){
	// 				console.log(songData);
	// 				if(songData){
	// 					var temp = {
	// 						cn: songData.cnCharLyrics.buffer.toString(),
	// 						eng: songData.engLyrics.buffer.toString(),
	// 						pinyin: songData.pinyinLyrics.buffer.toString(),
	// 						times: songData.times.buffer.toString()						};

	// 					// console.log(songData.cnCharLyrics.buffer.toString());
	// 					res.end(JSON.stringify(temp), 'utf-8');
	// 					seed.close();
	// 			  	}
	// 			  	else{
	// 			  		throw new Error ('Song not found');
	// 			  	}
	// 			});

	// 		}
	// 		catch (err){
	// 			console.log(err);
	// 			var placeholder  = {
	// 				_id: 9999,
	// 			    title_pinyin: 'No Results Found',
	// 			    cn_char: 'No Results Found',
	// 			    file_name: '1',
	// 			    artist: '',
	// 			    artist_pinyin: '',
	// 			    searchTerm: 'No Results Found',
	// 			    cnCharLyrics: 'Song Not Found',
	// 			    pinyinLyrics: 'Song Not Found',
	// 			    engLyrics: 'Song Not Found'
	// 			};
	// 		    res.end(JSON.stringify(placeholder), 'utf-8');
	// 		    seed.close();
	// 		}
	// 	}
	// })

});
app.get('/artists', function(req,res){
	var MongoClient = mongodb.MongoClient;
	var url = mongoURL

	MongoClient.connect(url, function(err, db){
		if(err)
			console.log('unable to connect to server', err);
		else{
			console.log('connection established');
			var collection = db.collection('songs');
			var query = [{$sort:{artist:-1}},{$group: {_id:"$artist", songs: {$push: "$$ROOT"}}}]
			try{
				collection.aggregate(query).toArray(function(err, result) {
					    if (err) throw err;
				   		console.log(result);
					    res.send(result);
					    db.close();
			  	});
			}
			catch (err){
				console.log(err);
				var placeholder = [];
				placeholder.push({
					_id: 9999,
				    title_pinyin: 'No Results Found',
				    cn_char: 'No Results Found',
				    file_name: '1',
				    artist: '',
				    artist_pinyin: '',
				    searchTerm: 'No Results Found'});
			    res.send(placeholder);
			    db.close();
			}
		}
	})
})


app.get('/query', function (req,res){
	var MongoClient = mongodb.MongoClient;
	var url = mongoURL

	//dont inject me...
	var cleansedQuery = xssfilters.inHTMLData(req.query.search);
	//and dont fail a regex
	cleansedQuery = escapeStringRegexp(cleansedQuery);
	console.log(cleansedQuery);

	MongoClient.connect(url, function(err, db){
		if(err)
			console.log('unable to connect to server', err);
		else{
			console.log('connection established');
			var collection = db.collection('songs');
			var regexValue='\.*'+ cleansedQuery +'\.';
			var query = {"searchTerm" : {$regex: new RegExp(regexValue, 'i')}}
			try{
				collection.find(query, {file_name: 1, cn_char: 1, artist :1 }).sort({cn_char: -1}).toArray(function(err, result) {
					    if (err) throw err;
				   		console.log(result);
					    res.send(result);
					    db.close();
			  	});
			}
			catch (err){
				console.log(err);
				var placeholder = [];
				placeholder.push({
					_id: 9999,
				    title_pinyin: 'No Results Found',
				    cn_char: 'No Results Found',
				    file_name: '1',
				    artist: '',
				    artist_pinyin: '',
				    searchTerm: 'No Results Found'});
			    res.send(placeholder);
			    db.close();
			}
		}
	})
});
