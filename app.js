var express = require("express"); // call express to be used by the application.
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');


app.use(express.static("scripts")); // allow app to use scripts
app.use(express.static("images")); // allow app to use images

app.get('/', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.sendFile('index.html', {root: VIEWS});
  console.log("Now you are home!");
});







app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("My App is running!...")
});
