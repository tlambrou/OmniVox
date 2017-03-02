function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

module.exports = function(app) {

  var mongoose = require('mongoose');
  var Poll = require('../models/poll.js');
  var Thought = require('../models/thought.js');
  var cookie = require('cookie');
  var cookieParser = require('cookie-parser');
  var slugify = require('slugify')

  //THOUGHT CREATE
  app.post('/:pollPath/thoughts', function (req, res) {
    path = { path : req.params.pollPath }
    Poll.findOne(path).exec(function (err, poll) {
      // console.log(poll)
      // var thought = req.body
      var cookie = req.signedCookies['user']
      var thought = new Thought(req.body)

      thought.creator = cookie
      console.log(thought)
      thought.save( function(err, thought) {
        if (err) {
          return res.status(300) };
          console.log(poll)
          poll.thoughts.push(thought);
          poll.save(function (err) {
            if (err) { return res.status(300) };
            console.log(poll.thoughts)
            res.status(200).json(thought);
          });
        })
      });
    });

  }
