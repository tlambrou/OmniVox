module.exports = function(app) {

  var mongoose = require('mongoose');
  var Poll = require('../models/poll.js');
  var Thought = require('../models/thought.js');

  //THOUGHT CREATE
  app.post('/:pollPath/thoughts', function (req, res) {
    path = { path : req.params.pollPath }
    Poll.findOne(path).exec(function (err, poll) {
      console.log(poll)
      var thought = req.body

      Thought.create(thought, function(err, thought) {
        if (err) {
          // console.log(err);
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
