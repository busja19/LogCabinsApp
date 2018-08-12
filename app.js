var express = require("express"); 
var app = express();
const path = require('path');
//path.join(__dirname, 'public')
const VIEWS = path.join(__dirname, 'views');
var passport = require('passport');

var nodemailer = require('nodemailer');




var session = require('express-session');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var fs = require('fs');
app.set('view engine', 'jade');


var mysql = require('mysql'); // allow access to sql


app.use(express.static("scripts")); // use scripts
//app.use(express.static("images")); // use images
app.use(express.static(__dirname + '/images'));
app.use(express.static("models"));//use models

var reviews = require("./models/reviews.json");

app.use(passport.initialize());
app.use(passport.session());

//app.use(session({ secret: "topsecret" })); // required to make the session accessable throughouty the application
app.use(require('express-session')({ secret: 'mysecret', resave: true, saveUninitialized: true }));


const LocalStrategy = require('passport-local').Strategy;

const db = mysql.createConnection({ //sql connection
 
host: 'den1.mysql4.gear.host',
user: 'logcabin',
password: 'Rl6WOB!-1XEx',
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


app.get('/index', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/created', (req, res) => res.send("error logging in"));

//passport
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});


passport.use(new LocalStrategy(
  function(username, password, done) {
      UserDetails.findOne({
        username: username
      }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
  }
));



// this is my Products Database table
app.get('/createtable', function(req,res){
 let sql = 'CREATE TABLE products (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price varchar(255), Image1 varchar(255), Image2 varchar(255), Image3 varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("DB Table")
});
//end of database table

// this is my Products details table
app.get('/createspectable', function(req,res){
 let sql = 'CREATE TABLE spec (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Wall varchar(255), Area varchar(255), Roof varchar(255), Room int(10), Window varchar(255), WindowS varchar(255), DoorS varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
 console.log(res);
 });
  res.send("Product Specification Table")
});

app.get('/addspec', function(req,res){
let sql = "ALTER TABLE spec ADD CONSTRAINT FK_prodspec FOREIGN KEY (Id) REFERENCES products(Id);";
let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);

});
  res.send("amend Specification Table");
});


//alter data type
app.get('/alterspec', function(req,res){
let sql = "ALTER TABLE spec MODIFY COLUMN Room varchar(255);";
 let query = db.query(sql,(err,res)=>{
 if (err) throw err;
 console.log(res);

});
  res.send("amend Specification Table 2")
});



//end of alter table


//Join Spec and Products
app.get('/join', function(req,res){
let sql = "SELECT * FROM products LEFT JOIN spec ON products.Id = spec.Id UNION ALL SELECT * FROM products RIGHT JOIN spec ON products.id = spec.id WHERE products.id IS NULL;";
 let query = db.query(sql,(err,res)=>{
 if (err) throw err;
 console.log(res);

});
  res.send("join")
});

 app.get('/prodspec', function(req, res){
 let sql = 'SELECT * FROM products LEFT JOIN spec ON products.Id = spec.Id UNION ALL SELECT * FROM products RIGHT JOIN spec ON products.id = spec.id WHERE products.id IS NULL;' 
 let query = db.query(sql, (err, res3) =>{
  
  if(err)
  throw(err);
 
  res.render('join', {root: VIEWS, res3}); 
 });
  console.log("Product and spec page!");
});


// this is my uiser reg table
app.get('/createusertable', function(req,res){
 let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Email varchar(255), Password varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
});
//users log in table - END


app.get('/insertspec', function(req,res){
 let sql = 'INSERT INTO spec (Wall, Area, Roof, Room, Window, WindowS, DoorS, Id) VALUES ("28 mm", "6.8 m²", "11.9 m²", "1", "4 mm Glass (Single Glazing)", "900×1450 mm", "1340×1800 mm", 3);'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  
 });
  res.send("new spec created")
 
});

app.get('/specId', function(req,res){
 let sql = 'ALTER TABLE spec RENAME COLUMN Id TO spId;'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
 });
  res.send("spec ID ref updated")
});
//end of SQL tables and amend tables

app.get('/', function(req, res){
  res.render('index.jade', {root: VIEWS});
  
   console.log("The status of this user is" + req.session.email);
  console.log("now you are on the home page!");
});


// function to render the products and specs page
app.get('/products', function(req, res){
 let sql = "SELECT * FROM products LEFT JOIN spec ON products.Id = spec.Id UNION ALL SELECT * FROM products RIGHT JOIN spec ON products.id = spec.id WHERE products.id IS NULL;";
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.render('products', {root: VIEWS, res1}); // use the render command so that the response object renders a HTML page
 });
 console.log("Now you are on the products page!");
 console.log("The Status of this user is " + req.session.email); // Log out the session value
});

app.get('/spec', function(req, res){
 let sql2 = 'SELECT * FROM spec;'
 let query = db.query(sql2, (err, res2) =>{
  if(err)
  throw(err);
  res.render('spec', {root: VIEWS, res2}); // use the render command so that the response object renders a HTML page
 });
 console.log("Now you are on the produc spec page!");
 console.log("The Status of this user is " + req.session.email); // Log out the session value
});

app.get('/join', function(req, res){
 let sql = 'SELECT * FROM join;'
 let query = db.query(sql, (err, res3) =>{
  if(err)
  throw(err);
  res.render('spec', {root: VIEWS, res3}); // use the render command so that the response object renders a HTML page
 });
 console.log("Join Page!");
 console.log("The Status of this user is " + req.session.email); // Log out the session value
});

//end

app.get('/item/:id', function(req, res){
 let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'  
 let query = db.query(sql, (err, res2) =>{
  if(err)
  throw(err);
  res.render('item', {root: VIEWS, res2}); // use the render command so that the response object renders a HTML page
 });
  console.log("Now you are on the Individual product page!");
});


 app.get('/prodspec', function(req, res){
 let sql = 'SELECT * FROM products LEFT JOIN spec ON products.Id = spec.Id UNION ALL SELECT * FROM products RIGHT JOIN spec ON products.id = spec.id WHERE products.id IS NULL;' 
 let query = db.query(sql, (err, res3) =>{
  
  if(err)
  throw(err);
  res.render('join', {root: VIEWS, res3}); 
  console.log("join page!");
});




app.get('/spec/:id', function(req, res){
 let sql2 = 'SELECT * FROM spec WHERE Id = "'+req.params.id+'";' 
 let query = db.query(sql2, (err, res2) =>{
  
  if(err)
  throw(err);
 
  res.render('itemspec', {root: VIEWS, res2}); 
 });
  console.log("spec page!");
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
  
res.render('created', {root: VIEWS});
});


 // function to render the createspec page
app.get('/createspec', function(req, res){
 
  res.render('createspec', {root: VIEWS});
  console.log("Now you are ready to create specs for products!");
});

 // function to add data to database based on button press
app.post('/createspec', function(req, res){
  var name = req.body.name
  let sql2 = 'INSERT INTO spec (Wall, Area, Roof, Room, Window, WindowS, DoorS, Id) VALUES ("'+req.body.wall+'", "'+req.body.area+'", "'+req.body.roof+'", "'+req.body.room+'", "'+req.body.window+'", "'+req.body.windows+'", "'+req.body.doors+'", "'+req.body.id+'" );'
  let query = db.query(sql2,(err,res2)=>{
  if (err) throw err;
  console.log(res2);
  console.log("Log Cabin spec")
 });
  
res.render('created', {root: VIEWS});
});


// function to edit database adta based on button press and form
app.get('/edit/:id', function(req, res){
 if(req.session.email == "LoggedIn"){
 let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);

 
 res.render('edit', {root: VIEWS, res1});   
    });
}else {
  res.render('login', {root:VIEWS});

 }
 console.log("Edit product page!");
});

app.post('/edit/:id', function(req, res){
let sql = 'UPDATE products SET Name = "'+req.body.newname+'", Image1 = "'+req.body.newimage1+'", Image2 = "'+req.body.newimage2+'", Image3 = "'+req.body.newimage3+'" WHERE Id = "'+req.params.id+'";'
let query = db.query(sql, (err, res1) =>{
 if(err) throw err;
 console.log(res);
})

res.redirect("/item/" + req.params.id);
});


// edit Product Spec PAge
app.get('/editspec/:id', function(req, res){
  // if(req.session.email == "LoggedIn"){
 let sql2 = 'SELECT * FROM spec WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql2, (err, res2) =>{
  if(err)
  throw(err);
  res.render('editspec', {root: VIEWS, res2}); 
 });
 
//}else{
 //res.render('login', {root:VIEWS});
  
//}
 console.log("EditProduct Spec Page!");
});



app.post('/editspec/:id', function(req, res){
let sql2 = 'UPDATE spec SET Wall = "'+req.body.newwall+'", Area = "'+req.body.newarea+'", Roof = "'+req.body.newroof+'", Room = "'+req.body.newroom+'", Window = "'+req.body.newwindow+'", WindowS = "'+req.body.newwindows+'", DoorS = "'+req.body.newdoors+'" WHERE Id = "'+req.params.id+'";'
let query = db.query(sql2, (err, res2) =>{
 if(err) throw err;
 console.log(res2);
})

res.redirect("/spec/" + req.params.id);
});
//end product spec edit page


 // function to delete database
app.get('/delete/:id', function(req, res){
 let sql = 'DELETE FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.redirect('/products'); 
 });
});

app.get('/deletespec/:id', function(req, res){
 let sql = 'DELETE FROM spec WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql2, (err, res2) =>{
  if(err)
  throw(err);
  res.redirect('/spec'); 
 });
});



// function to render the FAQ page
app.get('/faq', function(req, res){
  res.render('faq', {root: VIEWS}); 
  console.log("FAQ Page!");
});



//reviews page
app.get('/reviews', function(req, res){
 res.render("reviews", {reviews:reviews}
 );
 console.log("company's reviews");
});

// route to render add JSON page
app.get('/addreview', function(req, res){
  res.render('addreview', {root: VIEWS});
  console.log("feedback!");
});

// post request to add JSON REVIEW

//add reviews
app.post('/addreview', function(req, res){
	var count = Object.keys(reviews).length; 
	console.log(count);
	
		function getMax(reviews , id) {
		var max
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(reviews[i][id]) > parseInt(max[id]))
				max = reviews[i];
    }
		return max;
	}
	
	var maxPpg = getMax(reviews, "id");
	newId = maxPpg.id + 1; 
	console.log(newId);
	var review = {
		name: req.body.name,
		id: newId, 
		content: req.body.content,

	};
		console.log(review) 
	var json  = JSON.stringify(reviews); 
	
 
	fs.readFile('./models/reviews.json', 'utf8', function readFileCallback(err, data){
		if (err){
		throw(err);
	 }else {
		reviews.push(review);
		json = JSON.stringify(reviews, null , 4); 
		fs.writeFile('./models/reviews.json', json, 'utf8'); 
		
	}});
	res.redirect("/reviews")
});
// End oofJSON

//edit reviews
app.get('/editreview/:id', function(req, res){
 function chooseProd(indOne){
   return indOne.id === parseInt(req.params.id)}
 
 console.log("Id of this review is " + req.params.id);
  var indOne = reviews.filter(chooseProd);
 res.render('editreview' , {indOne:indOne});
  console.log("Edit Review Page Shown");
 });

app.post('/editreview/:id', function(req, res){
 var json = JSON.stringify(reviews);
 var keyToFind = parseInt(req.params.id); 
 var data = reviews; 
 var index = data.map(function(review){review.id}).keyToFind 
  //var x = req.body.name;
 var y = req.body.content
 var z = parseInt(req.params.id)
 reviews.splice(index, 1, {name: req.body.name, content: y, id: z});
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./models/reviews.json', json, 'utf8'); 
 res.redirect("/reviews");
});

//delete reviews
app.get('/deletereview/:id', function(req, res){
 var json = JSON.stringify(reviews);
 var keyToFind = parseInt(req.params.id);
 var data = reviews;
 var index = data.map(function(d){d['id'];}).indexOf(keyToFind)
 
 reviews.splice(index, 1);
 
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./models/reviews.json', json, 'utf8'); 
 res.redirect("/reviews");
});



//this is my search button functionality
app.post('/search', function(req, res){
 let sql = 'SELECT * FROM products WHERE Name LIKE "%'+req.body.search+'%";'
 let query = db.query(sql, (err,res1) =>{
  if(err)
  throw(err);
   
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

app.get('/login', function(req, res){
  res.render('login', {root: VIEWS});
});



 app.post('/login', function(req, res) {
  var whichOne = req.body.name;
  var whichPass = req.body.password;
  
   let sql2 = 'SELECT name, password FROM users WHERE name= "'+whichOne+'"'
   let query = db.query(sql2, (err, res2) => {
    if(err) throw err;
    console.log(res2);
    
    var passx= res2[0].password
    var passxn= res2[0].name
    console.log("You logged in with " + passx + " and name " + passxn );
    req.session.email = "LoggedIn";
  
    if(passx == whichPass){
    console.log("It Worked! Logged in with: " + passx + " , " + whichPass);
    
   res.redirect("/");
  }
  else{res.redirect("login");}
   //res.render("index.jade");
    //res.render("showit.jade", {res1,res2});
  });
 
  });

//LOG OUT ROUTE
app.get('/logout', function(req, res){
 res.render('logout', {root:VIEWS});
 req.session.destroy(session.email);
})

//END LOG OUT ROUTE


//contact page route
app.get('/contact', function(req, res){
  res.render('contact', {root: VIEWS});
 });


app.post('/contact', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'dnevedomska29@gmail.com',
      pass: 'dUBLIN2016'
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: "dnevedomska29@gmail.com",
    subject: 'New message',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, info) {
    if (error) {
      console.log(error);
      res.json({yo: 'error'});
    }
    else {
        console.log('Message sent: ' + info.response);
        res.render('mailsend', {root: VIEWS});
    }
  });
});
//end of contact page




app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("My App is running!...")
});
