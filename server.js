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
var imageIndex;

// Server configuration
app.set("ipaddr", "127.0.0.1");

//Connect using localhost: 2020
app.set('port', 7000);
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

app.get('/', function(request, response) {
	response.render('index');
});

app.get('/addition', function(request, response) {
	response.render('addition');
});

app.get('/time', function(request, response) {
	response.render('time');
});

app.get('/viewer', function(request, response) {
	response.render('viewer');
});

app.get('/images', function(request, response) {
	console.log('Inside images.');
	imageModel.find().exec(function(err, docs) {
		docs.forEach(function(doc) {
			imageArray.push(doc);
		});
		//shuffledArray = shuffle(imageArray);
		shuffledArray = imageArray;
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

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function saveData() {
	imageModel.find().exec(function(err, docs) {
		docs.forEach(function(doc) {
			fs.appendFile('imageEntriesBackup.txt', doc, function(err) {
				if(err) throw err;
				console.log('Wrote ' + doc);
			});
		});
	});	
}
