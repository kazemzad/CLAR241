/*var mongodb = require('mongodb'),
	MongoClient = mongodb.MongoClient;

var environment = 'mongodb://Sahar:password@oceanic.mongohq.com:10053/app23566905';
//console.log('Environemtn var is ' + process.env.MONGOHQ_URL);
MongoClient.connect(environment, function(err, db) {
	//operate on the collection tst
	if(err) throw err;
	console.log('Type of db is ' + db);
	var collection = db.collection('test');

	//Insert two dcouments
	console.log('Inserting...');
	collection.insert([{name: 'tester'}, {name: 'coder'}], function(err, docs) {
		if(err) throw err;
		console.log('Just inserted ' + docs.length + ' new docs.');
		collection.find({}).toArray(function(err, docs) {
			if(err) throw err;
			docs.forEach(function(doc) {
				console.log('Found doc: ' + doc);
			});
		});
	});
});
*/
var express = require('express'),
	app = express(),
	fs = require('fs'),
	http = require('http').createServer(app),
	path = require('path'),
	mongoose = require('mongoose'),
	db = mongoose.createConnection('mongodb://localhost/archaeology'),
	_ = require('underscore');

var imageArray = new Array;
var shuffledArray = new Array;
var dates = new Array;
var imageIndex;

// Server configuration
app.set("ipaddr", "127.0.0.1");

//Connect using localhost
app.set('port', 8080);
app.set('views', __dirname + '/views');

//View engine is Jade
app.set('view engine', 'jade');
app.use(express.static('public', __dirname + '/public'));
//app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Start the http server at port and IP defined before
http.listen(app.get("port"), app.get("ipaddr"), function() {
	console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});

var imageSchema = new mongoose.Schema({
	name: {type: String},
	filename: {type: String},
	site: {type: String},
	period: {type: String},
	date: {type: String},
	material: {type: String},
	description: {type: String}
}, {collection: 'imageEntries'});

var imageModel = db.model('ImageModel', imageSchema);

function date(period, time) {
	this.period = period;
	this.time = time;
}

function addDate(period,time) {
	dates.push(new date(period,time));
}

addDate('Old Assyrian Colony', '1920-1740');
addDate('Old Babylonian', '1894-1595');
addDate('Old Hittite Kingdom', '1650-1400');
addDate('Kassite', '1600-1100');
addDate('Middle Assyrian', '1500-1000');
addDate('Hittite Empire', '1300-1200');
addDate('King Tudhaliya', '1250-1200');
addDate('Troy 6', '1300-1200');
addDate('Troy 7 A/B', '1200-1100');
addDate('Assyrian Empire', '883-627');
addDate('Assurnasirpal II', '883-859');
addDate('Shalmaneser III', '859-824');
addDate('Tiglath-Pileser III', '744-727');
addDate('Sargon', '721-705');
addDate('Sennacherib', '705-681');
addDate('Assurbanipal', '668-627');

console.log('Dates length is ' + dates.length);

app.post('/addContent', function(request, response) {
	var name = request.body.name;
	var filename = request.body.filename;
	var site = request.body.site;
	var period = request.body.period;
	var date = request.body.date;
	var material = request.body.material;
	var description = request.body.description;

	var entry = new imageModel({
		name: name,
		filename: filename,
		site: site,
		period: period,
		date: date,
		material: material,
		description: description
	});

	entry.save(function(err, entry) {
		if(err) {
			console.log(err);
			return;
		}
		console.log('Successfully added entry.');
	});

	response.json(200, {message: 'Success'});
});

//editFileName('5328550564c30bb608324da6', 'assurnasirpallions.jpeg');

app.get('/', function(request, response) {
	response.render('viewer');
});

app.get('/addition', function(request, response) {
	response.render('addition');
});

app.get('/time', function(request, response) {
	response.render('time');
});

app.get('/test', function(request, response) {
	response.render('test');
});

app.get('/vocab', function(request, response) {
	response.render('vocab');
});

app.get('/timeline', function(request, response) {
	response.render('timeline');
});

app.get('/viewer', function(request, response) {
	response.render('viewer');
});
app.get('/images', function(request, response) {
	console.log('Inside images.');
	imageModel.find().exec(function(err, docs) {
		docs.forEach(function(doc) {
			if(doc.site.toLowerCase() == 'malatya') {
				//console.log('Site is ' + doc.site + ' ' + doc.filename);
			}
			else if(doc.period.toLowerCase() == 'neo-hittite') {
				imageArray.push(doc);
			}
			//else imageArray.push(doc);
		});
		shuffledArray = shuffle(imageArray);
		response.json(200, {array: shuffledArray});
	});	
});

app.post('/edit', function(request, response) {
	var label = request.body.label;
	var id = request.body.id;
	var value = request.body.value;
	console.log('Label is ' + label);

	if(label == 'date') {
		imageModel.findByIdAndUpdate(id, {date: value}, function(err, result) {
			if(err) throw err;
			console.log('Updated ' + label + ' to ' + value + ' for ' + id);
			console.log('Result is '+ result + ' with type ' + typeof(result));
			response.json(200);
		});
	}
	else if(label == 'name') {
		imageModel.findByIdAndUpdate(id, {name: value}, function(err, result) {
			if(err) throw err;
			console.log('Updated ' + label + ' to ' + value + ' for ' + id);
			console.log('Result is '+ result + ' with type ' + typeof(result));
			response.json(200);
		});
	}
	else if(label == 'site') {
		imageModel.findByIdAndUpdate(id, {site: value}, function(err, result) {
			if(err) throw err;
			console.log('Updated ' + label + ' to ' + value + ' for ' + id);
			console.log('Result is '+ result + ' with type ' + typeof(result));
			response.json(200);
		});
	}
	else if(label == 'period') {
		imageModel.findByIdAndUpdate(id, {period: value}, function(err, result) {
			if(err) throw err;
			console.log('Updated ' + label + ' to ' + value + ' for ' + id);
			console.log('Result is '+ result + ' with type ' + typeof(result));
			response.json(200);
		});
	}
	else if(label == 'material') {
		imageModel.findByIdAndUpdate(id, {material: value}, function(err, result) {
			if(err) throw err;
			console.log('Updated ' + label + ' to ' + value + ' for ' + id);
			console.log('Result is '+ result + ' with type ' + typeof(result));
			response.json(200);
		});
	}
	else if(label == 'description') {
		imageModel.findByIdAndUpdate(id, {description: value}, function(err, result) {
			if(err) throw err;
			console.log('Updated ' + label + ' to ' + value + ' for ' + id);
			console.log('Result is '+ result + ' with type ' + typeof(result));
			response.json(200);
		});
	}
});

app.get('/dates', function(request, response) {
	response.json(200, {dates: dates});
});

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function editFileName(id, newName) {
	imageModel.findByIdAndUpdate(id, {filename: newName}, function(err, result) {
		if(err) throw err;
		console.log('Updated filename to ' + newName + ' for ' + id);
	});
}

function saveData() {
	imageModel.find().exec(function(err, docs) {
		docs.forEach(function(doc) {
			fs.appendFile('imageEntriesBackup5.txt', doc.name + '\n' + doc.period + '\n' + doc.date + '\n' + doc.site + '\n' + doc.description + '\n' + '\n' + '\n', function(err) {
				if(err) throw err;
				console.log('Wrote ' + doc);
			});
		});
	});	
}

/*var mongodb = require('mongodb'), MongoClient = mongodb.MongoClient;
MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
	var collection = db.collection('test');
	collection.insert([{name: 'tester'}, {name: 'coder'}], function(err, docs) {
		if(err) throw err;
		console.log('Just inseted ' + docs.length);
		collection.find({}).toArray(function(err, docs) {
			if(err) throw err;
			docs.forEach(function(doc) {
				console.log('Found ' + doc);
			});
		});
	});

});*/

