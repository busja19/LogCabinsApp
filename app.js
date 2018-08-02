var express = require("express"); // call express to be used by the application.
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');

app.set('view engine', 'jade');

var mysql = require('mysql'); // access to sql

app.use(express.static("scripts")); // use scripts
app.use(express.static("images")); // use images



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
 let sql = 'INSERT INTO products (Name, Price, Image, Activity) VALUES ("BORDEUX LOG CABIN 5.0 X 4.45 M", 3,950, "Products/Bordeaux.jpg", "Products/Bordeaux2.jpg","Products/BordeauxDrawings.jpg",);'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("new log cabin created!")
 
});
// End SQL insert data into the table






app.get('/', function(req, res){
  res.render('index.jade', {root: VIEWS});
  console.log("Now you are home!");
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








// function to render the FAQ page
app.get('/faq', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.sendFile('faq.html', {root: VIEWS}); // use the render command so that the response object renders a HHTML page
  console.log("FAQ PAge!");
});



app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("My App is running!...")
});
