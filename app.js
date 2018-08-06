var express = require("express"); // call express to be used by the application.
var app = express();
const path = require('path');
path.join(__dirname, 'public')
const VIEWS = path.join(__dirname, 'views');

app.set('view engine', 'jade');




var session = require('express-session');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var mysql = require('mysql'); // allow access to sql


app.use(express.static("scripts")); // use scripts
//app.use(express.static("images")); // use images
app.use(express.static(__dirname + '/images'));


//app.use(session({ secret: "topsecret" })); // required to make the session accessable throughouty the application
app.use(session({ secret: 'anything', resave: true, saveUninitialized: true }));



const db = mysql.createConnection({ //sql connection
 
host: 'den1.mysql4.gear.host',
user: 'logcabin',
password: 'Rl6WOB!-1XEx',
database: 'logcabin'
}); 
//host: 'den1.mysql6.gear.host',
//user: 'nodedatabase',
//password: 'Kn6E69-nlY9-',
//database: 'nodedatabase'
//}); 

db.connect((err) =>{
 if(err){
  console.log("your database is not connected");
 }
 else{
  console.log("connected to Database");
 }
});


// this is my Products Database table
app.get('/createtable', function(req,res){
 let sql = 'CREATE TABLE products (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image1 varchar(255), Image2 varchar(255), Image3 varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("DB Table")
});
//end of database table



app.get('/createusertable', function(req,res){
 let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Email varchar(255), Password varchar(255),);'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("users table created!")
 
});
//users log in table - END








// SQL QUERY Just for show Example
app.get('/queryme', function(req,res){
 let sql = 'SELECT * FROM products'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("Look in the console....")
 
});
// End SQL QUERY Just for show Example

// SQL QUERY Just for show Example
app.get('/info', function(req,res){
 let sql = 'SELECT * FROM INFORMATION_SCHEMA.TABLES'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("info table....")
 
});
// End SQL QUERY Just for show Example






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
 console.log("The Status of this user is " + req.session.email); // Log out the session value
});


app.get('/item/:id', function(req, res){
 let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";' 
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('item', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  
 });
 
 
  console.log("Now you are on the Individual product page!");
});

 


 // function to render the create page
app.get('/create', function(req, res){
 
  res.render('create', {root: VIEWS});
  console.log("Now you are ready to create!");
});

 // function to add data to database based on button press
app.post('/create', function(req, res){
  var name = req.body.name
  let sql = 'INSERT INTO products (Name, Price, Image1, Image2, Image3) VALUES ("'+name+'", '+req.body.price+', "'+req.body.image1+'", "'+req.body.image2+'", "'+req.body.image3+'");'
  let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  console.log("the Name of the product is " + name)
 });
  
res.render('index', {root: VIEWS});
});





//////////////////////////////////
////////////////////////////////// NOT UPDATED FOR MY APP
// function to edit database adta based on button press and form
app.get('/edit/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);


//app.get('/edit/:id', function(req, res){
 //if(req.session.email == "LoggedIn"){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 //let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'
 //let query = db.query(sql, (err, res1) =>{
 // if(err)
 // throw(err);
  res.render('edit', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  
 });
 
// }
 
// else {
  //res.render('login', {root:VIEWS});
  
// }
 
 console.log("Now you are on the edit product page!");
});



app.post('/edit/:id', function(req, res){
let sql = 'UPDATE products SET Name = "'+req.body.newname+'", Price = "'+req.body.newprice+'", Image1 = "'+req.body.newimage+'" WHERE Id = "'+req.params.id+'";'
let query = db.query(sql, (err, res) =>{
 if(err) throw err;
 console.log(res);
 
})

res.redirect("/item/" + req.params.id);

});



 // function to delete database adta based on button press and form
app.get('/delete/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'DELETE FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.redirect('/products'); // use the render command so that the response object renders a HHTML page
  
 });
 
 console.log("Its Gone!");
});




// function to render the FAQ page
app.get('/faq', function(req, res){
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


//Render register in function

app.get('/register', function(req, res){
  res.render('register', {root:VIEWS});
});

app.post('/register', function(req, res){
db.query('INSERT INTO users (Name, Email, Password) VALUES ("'+req.body.name+'", "'+req.body.email+'", "'+req.body.password+'")'
        );
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
