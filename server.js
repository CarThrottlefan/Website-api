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
const cors = require('cors');
app.use(cors({
    origin: '*' //TODO maybe find a way so you can give request permission just to the website adresses (ISSUE now is the fact that the /item/*num* is dynamic, since u need all id's to be accessible)
}));

// We need some middleware to parse JSON data in the body of our HTTP requests:
app.use(express.json());


// ###############################################################################
// Routes
// 


//---------------------A simple test to see if the server is operational(left this in on purpose) ------------
// This example route responds to http://localhost:3000/hello with an example JSON object.
app.get("/hello", function(req, res) {
	response_body = {'Hello': 'World'} ;

	// This example returns valid JSON in the response, but does not yet set the
	// associated HTTP response header. 
	res.json(response_body) ;
});

//-----------------------Update functionality -----------------
app.put("/currDb/item/:uid/", function(req, res){
	idReq = req.params.uid;
	item = req.body;
	let fail = false;
	let errType = '';

	db.get(`SELECT EXISTS(SELECT 1 FROM gallery WHERE id=?)`, [idReq], (err, row) => {
		if (err) {
		  console.error(err.message);
		}
		if (!row['EXISTS(SELECT 1 FROM gallery WHERE id=?)']) {
		  res.status(404);
		  return res.json('Error - item with the given ID does not exist');
		} 
		else 
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
								console.log('Malformed user input, missing' + errType);
								return res.json('Error - missing attributes' + errType);
							}
							else{
								res.status(200);
								return res.json('Update completed successfully'); 
							}
				});			
			}
	  });	
});

//---------------------Inserting a new entry in the database --------------------
app.post("/currDb/", function(req, res){
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
						console.log('Malformed user input, missing' + errType);
						return res.json('Error - missing attributes' + errType);
					}
					else{
						res.status(201);
						return res.json('Item added successfully'); 
					}
				});			
});
// ###############################################################################



//------------Retrieves the whole database ------------------------
app.get('/currDb/', function(req, res) { 
	
	db.all("SELECT * FROM gallery", (err, rows) => {
		if(err)
		{
			res.status(404);
			console.error(err.message);
		}
		else
		{
			res.set('Content-Type', 'application/json');
			res.status(200);
			return res.json(rows);
		}
		
	});
});

//--------------Retrieves a single item, based on the query id ----------------------
app.get('/currDb/item/:id/', function(req, res) { 
	let id = req.params.id;
	db.all(`SELECT * FROM gallery WHERE id = ?`, [id], (err, rows) => {
		
		if(err)
		{
			res.status(404);
			return res.json('Not found');
		}
		else if (rows.length === 0)
		{
			res.status(404);
			return res.json('Not found');
		}
		else
		{
			res.set('Content-Type', 'application/json');
			res.status(200);
			return res.json(rows);
		}
	});
});

//---------------Deletes a single entry in the db --------------------------
app.delete("/currDb/item/:id/", function(req, res) {
	db.run(`DELETE FROM gallery WHERE id = ?`, [req.params.id], function(err, result) {
	  if (err) {
		res.status(500);
		return res.json(err.message);
	  } 
	  else {
		if (this.changes > 0) {
		  res.status(204);
		  return res.json("Successfully deleted");
		}
		else {
		  res.status(404);
		  return res.json("Not Found");
		}
	  }
	});
  });

//------------------Resets database to its initial values ----------------
app.delete("/currDb/", function(req, res) {
	
	db.run(`DELETE FROM gallery`, (err) => {
		if(err) {
			res.status(500);
			return res.json(err.message);
		}
		else {
			db.all("SELECT * FROM gallery", (err, rows) => {
				if(err)
				{
					res.status(404);
					console.error(err.message);
				}
				if(rows.length > 0)
				{
					res.status(400);
					return res.json('Database not deleted');
				}
				else
				{
					recreateDatabase(true); //For testing the delete function, comment this line
					res.status(205);
					return res.json('Database deleted successfully. Reinitialized default values');
				}
			});
		}
	});
});

// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Connected to the database.');
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
					console.log("Database contains", result[0].count, "item(s) at startup.");
				}
			});
			
		});
		return db;
	}
	
//-----------------Remakes the database with the original values, after succesful deletion----------------------
function recreateDatabase(deleteCheck)
{
	if(deleteCheck)
	{
		db = my_database('./gallery.db');
	}
	return db;
}