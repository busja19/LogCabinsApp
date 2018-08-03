var express = require("express"); // call express to be used by the application.
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');

app.set('view engine', 'jade');

var session = require('express-session');

var mysql = require('mysql'); // access to sql

app.use(express.static("scripts")); // use scripts
app.use(express.static("images")); // use images

//app.use(session({ secret: "topsecret" })); // required to make the session accessable throughouty the application
app.use(session({ secret: 'anything', resave: true, saveUninitialized: true }));



const db = mysql.createConnection({ //sql connection
 
host: 'den1.mysql2.gear.host',
user: 'logcabin',
password: 'Xu4SX~1J_tLJ',
database: 'logcabin'
}); 

db.connect((err) =>{
 if(err){
  console.log("your database is not connected");
 }
 else{
  console.log("connected to Database");
 }
});


// this is my Database table
app.get('/createtable', function(req,res){
 let sql = 'CREATE TABLE products (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image1 varchar(255), Image2 varchar(255), Image3 varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("DB Table")
});
//end of database table




// SQL insert data into the table
app.get('/insert', function(req,res){
 let sql = 'INSERT INTO products (Name, Price, Image, Image2, Image3) VALUES ("BORDEUX LOG CABIN 5.0 X 4.45 M", 3950, "Products/Bordeaux.jpg", "Products/Bordeaux2.jpg","Products/BordeauxDrawings.jpg");'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("new log cabin created!")
 
});
// End SQL insert data into the table





app.get('/', function(req, res){
  res.render('index.jade', {root: VIEWS});
  
   console.log("The status of this user is" + req.session.email); // log out session value
  console.log("now you are on the home page!");
});


// function to render the products page
app.get('/products', function(req, res){
 let sql = 'SELECT * FROM products;'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.render('products', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
 });
 console.log("Now you are on the products page!");
});

// function to render the individual products page
app.get('/item/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";' 
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('item', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  
 });
 
 
  console.log("Now you are on the Individual product page!");
});

//////////////////////////////////
////////////////////////////////// NOT UPDATED FOR MY APP

 // function to edit database adta based on button press and form
app.get('/edit/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 if(req.session.email == "LoggedIn"){
  let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('edit', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  
 });
 }
  else{
  res.render('login', {root:VIEWS});
    
  }
 
 console.log("Now you are on the edit product page!");
});

////////////////////////////////





// function to render the FAQ page
app.get('/faq', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.sendFile('faq.html', {root: VIEWS}); // use the render command so that the response object renders a HHTML page
  console.log("FAQ PAge!");
});



//this is my search button functionality

app.post('/search', function(req, res){
 
 let sql = 'SELECT * FROM products WHERE Name LIKE "%'+req.body.search+'%";'
 let query = db.query(sql, (err,res1) =>{
  if(err)
  throw(err);
 // res.redirect("/error")
  
  res.render('products', {root: VIEWS, res1});
  console.log("good search")
 });

 
});

//users log in table

app.get('/createusertable', function(req,res){
 let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Email varchar(255), Password varchar(255),);'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("users table created!")
 
});
//users log in table - END

//Render User log in function

app.get('/register', function(req, res){
  res.render('register', {root:VIEWS});
});

app.post('/register', function(req, res){
  db.query('INSERT INTO users (Name, Email, Password) VALUES ("'+req.body.name+'", "'+req.body.email+'", "'+req.body.password+'")');
 //session management starts here - need to install npm
  
  req.session.email = "you are logged in";
 // req.session.who = req.body.name;
  res.redirect('/')
});


//render log in page
app.get('/login', function(req, res){
  res.render('login', {root:VIEWS});
});

app.post('/login', function(req, res){
  var whichOne = req.body.name;
  var whichPass = req.body.password;
  let sql2 = 'Select name, password FROM users WHERE name = "'+req.body.name+'"'
  let query = db.query(sql2, (err, res2) =>{
    if(err) throw(err);
    console.log(res2);
    var passx = res2[0].password;
    var passxn = res2[0].name;
    
    if(passx == whichPass){
      req.session.email = "Logged In"
    console.log("you logged in as Password " + passx + " and Username " + passxn)
  }
   else {
res.redirect("/index");
                       
  } 
  
  });

});



//LOG OUT ROUTE
app.get('/logout', function(req, res){
  res.render('/index', {root:VIEWS});
  
  req.session.destroy(session.email)
  
}),

//END LOG OUT ROUTE

//this is my search button - end

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("My App is running!...")
});
