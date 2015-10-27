var express = require('express');
var app = express();
app.engine('.html', require('ejs').renderFile);
var util = require('util');
var fs = require('fs');
var bodyParser = require('body-parser');

//--postgresql daqtabase connection client 
var pg = require('pg'),
                     connectionString = process.env.DATABASE_URL;
    
var client = new pg.Client(connectionString);
client.connect(); 

app.set('port', (process.env.PORT || 5000));

app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json', limit: '10mb'}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index.html');
});

app.get('/load', function(request, response) {
  var queryString = "SELECT image FROM canvas WHERE snapshotID = 1";

  var data = 'nullo';

  var query = client.query(queryString);
  query.on('row', function(d){
  	data = d;
  });
  query.on('end', function(){
  	response.send(data);
  });

});

app.post('/canvas', function(request, response) {
	var data = request.body;

	imgURL = JSON.stringify(request.body['imgURL']);

	console.log('imgURL:');
	console.log(imgURL);

	var queryString = "INSERT INTO canvas (image) VALUES ( '" + imgURL + "')";

	var query = client.query(queryString);
	query.on('end', function(){
		console.log('Inserted image');
		response.send('Inserted image');
	});

});

app.post('/save', function(request, response) {

	var data = request.body;

	imgURL = JSON.stringify(request.body['imgURL']);

	var queryString = "UPDATE canvas SET image = '" + imgURL + "' WHERE snapshotID = 1";

	var query = client.query(queryString);
	query.on('end', function(){
		console.log("Updated");
		response.send("Updated canvas");
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

