var express = require("express"); // call express to be used by the application.
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');

app.set('view engine', 'jade');

app.use(express.static("scripts")); // allow app to use scripts
app.use(express.static("images")); // allow app to use images

app.get('/', function(req, res){
  res.render('index.jade', {root: VIEWS});
  console.log("Now you are home!");
});


// function to render the products page
app.get('/products', function(req, res){
   res.sendFile('products.html', {root: VIEWS}); // use the render command so that the response object renders a HHTML page
  console.log("Product Page!");
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
