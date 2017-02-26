// Declarations
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var cookieParser = require('cookie-parser');

// DB Setup
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/myapp');
mongoose.Promise = global.Promise;
// var Post = require('./models/post.js');
var User = require('./models/user.js');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected to the db!
});

// Middleware
app.use(express.static('public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use(cookieParser());
//
// app.use(jwt({
//   secret: 'shhhhhhared-secret',
//   getToken: function fromHeaderOrCookie (req) { //fromHeaderOrQuerystring
//     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//       return req.headers.authorization.split(' ')[1];
//     } else if (req.cookies && req.cookies.token) {
//       return req.cookies.token;
//     }
//     return null;
//   }
// }).unless({path: ['/', '/login', '/signup']}));

//ROUTES
//===========
require('./controllers/auth.js')(app);
require('./controllers/post.js')(app);
require('./controllers/user.js')(app);
require('./controllers/custom.js')(app);
require('./controllers/index.js')(app);
require('./controllers/comment.js')(app);

// SERVER
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Starter app listening on port 3000!');
});
