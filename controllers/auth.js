module.exports = function(app) {

  var User = require('../models/user.js');
  var jwt = require('jsonwebtoken');

  //SIGN UP
  app.get('/signup', function (req, res) {
    res.render('signup');
  });

  app.post('/signup', function (req, res) {
    var user = new User(req.body);
    user.save(function (err) {
      if (err) console.log(err);
      var tass_token = jwt.sign({ _id: user._id }, 'shhhhhhared-secret');
      Cookies.set('token', data.token);
      // IF YOU'D LIKE TO REDIRECT NOW, ADD THIS:
      window.location.href = "/";
      // saved!
    });
  });


  //LOGIN
  app.get('/login', function(req, res) {
    res.render('login');
  });

}
