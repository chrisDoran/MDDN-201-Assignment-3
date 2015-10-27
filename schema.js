var pg = require('pg'),
                 connectionString = process.env.DATABASE_URL,
                 client;

client = new pg.Client(connectionString);
client.connect();

var query = client.query('CREATE TABLE canvas ( snapshotID serial PRIMARY KEY, image text);');
query.on('end', function(){
	client.end();
	console.log("Successfully initialised database schema");
});