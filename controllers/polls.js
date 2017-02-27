module.exports = function(app) {

  var mongoose = require('mongoose');
  var Poll = require('../models/poll.js');
  var Thought = require('../models/thought.js');


  //POLL NEW
  app.get('/', function(req, res) {
    res.render('polls-new')
  })

  // POLL SHOW
  app.get('/:pollPath', function(req, res) {
    // Create an object out of the id
    var pollPath = { path : req.params.pollPath }

    // Look for a the object by the path given
    var poll = Poll.findOne(pollPath).populate('thoughts').exec(function(err, poll) {
      if (err) {
        console.log(err)
      }
      else {
        if ( !poll ) {
          var newPoll = new Poll(pollPath)
          newPoll.save(function (err) {
            console.log(newPoll);
            res.render('poll-show'), {poll: newPoll};
          });

        } else {
          res.render('poll-show', {poll: poll});
        };
      };
    });
  });

  //POLLS INDEX
  app.get('/polls', function(req, res) {
    Poll.find().sort({'_id': -1}).exec(function(err, polls) {
      res.render('polls-index', { polls: polls});
    });
  });

  //POLL SHOW
  app.get('/pollId', function (req, res) {
    var poll = Poll.findById(req.params.id).populate('thoughts').exec(function(err, poll){
      res.render('poll-show', {poll: poll});
    });
  });

  //POLL CREATE
  app.post('/polls', function (req, res) {
    var poll = new Poll(req.body);

    poll.save(function (err) {
      console.log(poll);
      res.send(poll);
    });
  });

  //POLL DELETE
  app.delete('/polls/:id', function (req, res) {
    Poll.findById(req.params.id).exec(function (err, poll) {
      poll.remove();

      res.status(200).json({});
    });
  });

  //POLL EDIT
  app.get('/polls/edit/:id', function (req, res) {
    var poll = Poll.findById(req.params.id).exec(function(err, poll){
      res.render('poll-edit', {poll: poll});
    });
  });

  //POLL UPDATE
  app.put('/polls/:id', function(req, res) {
    Poll.findById(req.params.id).exec(function(err, poll) {
      if (err) { return res.send(err) }
      poll.title = req.body.title;
      poll.path = req.body.path;
      poll.description = req.body.description;

      poll.save(function(err, poll) {
        if (err) { return res.send(err) }
        res.send(poll)
      })
    })
  })
}
