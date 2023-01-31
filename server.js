// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3
//
// The assignment description is available on Canvas. 
// Please read it carefully before you proceed.
//
// This is a template for you to quickly get started with Assignment 3.
// Read through the code and try to understand it.
//
// Have you read the zyBook chapter on Node.js?
// Have you looked at the documentation of sqlite?
// https://www.sqlitetutorial.net/sqlite-nodejs/
//
// Once you are familiar with Node.js and the assignment, start implementing
// an API according to your design by adding routes.


// ###############################################################################
//
// Database setup:
// First: Our code will open a sqlite database file for you, and create one if it not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'phones.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require('sqlite3').verbose();
let db = my_database('./gallery.db');

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();

// We need some middleware to parse JSON data in the body of our HTTP requests:
app.use(express.json());


// ###############################################################################
// Routes
// 
// TODO: Add your routes here and remove the example routes once you know how
//       everything works.

app.put("/currDb/item/:uid", function(req, res){ //TODO ask if I can use a patch method, instead of PUT. IF so, remove the checks for null, since a patch method only changes parts of an entry. (in theory)

	idReq = req.params.uid;
	console.log(idReq + ' id of curr');
	item = req.body;
	let fail = false;
	let errType = '';

	db.get(`SELECT EXISTS(SELECT 1 FROM gallery WHERE id=?)`, [idReq], (err, row) => {
		if (err) {
		  console.error(err.message);
		}
		if (!row['EXISTS(SELECT 1 FROM gallery WHERE id=?)']) {
		  res.status(404);
		  res.json('Error - item with the given ID does not exist');
		} else 
		{
			db.run(`UPDATE gallery
				SET author=?, alt=?, tags=?, image=?, description=? WHERE id=?`,
				[item['author'], item['alt'], item['tags'], item['image'], item['description'], idReq], (err) => {
				if (err) {
					console.error(err.message);
				}
				item['id'] = idReq;
				// rest of the code to check for missing fields and return the appropriate response
				if(item['author'] == null)
							{
								errType += ' #author';
								fail = true;
							}
		
							if(item['alt'] == null)
							{
								errType += ' #alt';
								fail = true;
							}
		
							if(item['tags'] == null)
							{
								errType += ' #tags';
								fail = true;
							}
		
							if(item['image'] == null)
							{
								errType += ' #image';
								fail = true;
							}
		
							if(item['description'] == null)
							{
								errType += ' #description';
								fail = true;
							}
		
							if(fail)
							{
								res.status(400);
								res.json('Error - missing attributes' + errType);
								console.log('Malformed user input, missing' + errType);
							}
							else{
								res.status(200);
								res.json('OK'); 
							}
				});			
		}
	  });	
});

app.post("/currDb/insert", function(req, res){
	item = req.body;
	let fail = false;
	let errType = '';

	db.run(`INSERT INTO gallery (author, alt, tags, image, description)
                VALUES (?, ?, ?, ?, ?)`,
                [item['author'], item['alt'], item['tags'], item['image'],  item['description']], () => {
					
					if(item['author'] == null)
					{
						errType += ' #author';
						fail = true;
					}

					if(item['alt'] == null)
					{
						errType += ' #alt';
						fail = true;
					}

					if(item['tags'] == null)
					{
						errType += ' #tags';
						fail = true;
					}

					if(item['image'] == null)
					{
						errType += ' #image';
						fail = true;
					}

					if(item['description'] == null)
					{
						errType += ' #description';
						fail = true;
					}

					if(fail)
					{
						res.status(400);
						res.json('Error - missing attributes' + errType);
						console.log('Malformed user input, missing' + errType);
					}
					else{
						res.status(200);
						res.json('OK'); 
					}
				});			
});
// ###############################################################################

// This example route responds to http://localhost:3000/hello with an example JSON object.
// Please test if this works on your own device before you make any changes.

app.get("/hello", function(req, res) {
    response_body = {'Hello': 'World'} ;

    // This example returns valid JSON in the response, but does not yet set the
    // associated HTTP response header.  This you should do yourself in your
    // own routes!
    res.json(response_body) ;
});

// This route responds to http://localhost:3000/db-example by selecting some data from the
// database and return it as JSON object.
// Please test if this works on your own device before you make any changes.
/*app.get('/db-example', function(req, res) {
    // Example SQL statement to select the name of all products from a specific brand
	db.all(`SELECT * FROM gallery WHERE author=?`, ['Grace Hopper'], function(err, rows) {
	
    	// TODO: add code that checks for errors so you know what went wrong if anything went wrong
    	// TODO: set the appropriate HTTP response headers and HTTP response codes here.

    	// # Return db response as JSON
    	return res.json(rows);
    });
});*/

app.get('/currDb', function(req, res) {
	
	db.all("SELECT * FROM gallery", (err, rows) => {
		res.set('Content-Type', 'application/json');
		res.status(200);
		
		if(err)
		{
			res.status(404);
			console.error(err.message);
		}
		
		return res.json(rows);
	});
});

app.get('/currDb/item/:uid', function(req, res) {
	let id = req.params.uid;
	db.all("SELECT author, alt, tags, image, description FROM gallery WHERE id=" + id, (err, rows) => {
		
		res.set('Content-Type', 'application/json');
		res.status(200);

		if(!db.all('SELECT id FROM gallery WHERE id=' + id))
		{
			console.log('err found');
			err = 'Not found';
		}

		if(err)
		{
			res.status(404);
			console.error(err.message);
		}
		
		return res.json(rows);
	});
});


app.post('/post-example', function(req, res) {
	// This is just to check if there is any data posted in the body of the HTTP request:
	console.log(req.body);
	return res.json(req.body);
});


// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	let i; //TODO see if needed
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS gallery
        	 (
                    id INTEGER PRIMARY KEY,
                    author CHAR(100) NOT NULL,
                    alt CHAR(100) NOT NULL,
                    tags CHAR(256) NOT NULL,
                    image char(2048) NOT NULL,
                    description CHAR(1024) NOT NULL
		 )
		`);
		db.all(`select count(*) as count from gallery`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO gallery (author, alt, tags, image, description) VALUES (?, ?, ?, ?, ?)`, [
        			"Tim Berners-Lee",
        			"Image of Berners-Lee",
        			"html,http,url,cern,mit",
        			"https://upload.wikimedia.org/wikipedia/commons/9/9d/Sir_Tim_Berners-Lee.jpg",
        			"The internet and the Web aren't the same thing."
    				]);
				db.run(`INSERT INTO gallery (author, alt, tags, image, description) VALUES (?, ?, ?, ?, ?)`, [
        			"Grace Hopper",
        			"Image of Grace Hopper at the UNIVAC I console",
        			"programming,linking,navy",
        			"https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg",
				"Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided to determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she was doing (she was then limited to one clock)."
    				]);
				console.log('Inserted dummy photo entry into empty database');
			} else {
				//i = result[0].count;
				console.log("Database contains", result[0].count, "item(s) at startup.");
			}
		});

	});
	return db;
}
