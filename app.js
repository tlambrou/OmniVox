// Declarations
var express = require('express')
var exphbs  = require('express-handlebars')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var jwt = require('express-jwt')
var cookie = require('cookie')
var cookieParser = require('cookie-parser')
var slugify = require('slugify')
var moment = require('moment')
var acceptOverride = require('connect-acceptoverride')

// var hbs = exphbs.create({
//     // Specify helpers which are only registered on this instance.
//     helpers: {
//         foo: function () { return 'FOO!'; },
//         bar: function () { return 'BAR!'; },
//         fromNow: function (){
//
//         };
//     }
// });

// DB Setup
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/omnivox')
mongoose.Promise = global.Promise;
// var Poll = require('./models/poll.js');
var User = require('./models/user.js');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected to the db!
});

// Middleware
app.use(express.static('public'))
app.use(acceptOverride())
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(cookieParser('FBIdata'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  var format = req.query.format
  if (format) {
    req.headers.accept = 'application/' + format
  }
  next();
});

//ROUTES
//===========
// require('./controllers/auth.js')(app);
require('./controllers/polls.js')(app);
require('./controllers/users.js')(app);
require('./controllers/custom.js')(app);
require('./controllers/index.js')(app);
require('./controllers/thoughts.js')(app);

// SERVER
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Omnivox.io listening on port 3000!');
});
