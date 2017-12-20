function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function checkAvailability(arr, val) {
  return arr.some(function(arrVal) {
    return val === arrVal;
  });
}

module.exports = function(app) {

  var mongoose = require('mongoose');
  var Poll = require('../models/poll.js');
  var Thought = require('../models/thought.js');
  var slugify = require('slugify')


  //POLL NEW
  app.get('/', function(req, res) {

    res.format({
      html: () => {
        res.render('polls-new')
      },
      json: () => {
        res.json({
          greeting: "Welcome to OmniVox.io",
          slogan: "Super-simple, super-fast polling for groups.",
          instruction: "Enter in the unique path of your poll to either join or create a new one.",
          placeholder: "Enter a Vox Code or Enter a New One."
        })
      }
    })
  })

  // POLL SHOW
  app.get('/:pollPath', function(req, res) {
    // Create an object out of the id
    var pollPath = { path : req.params.pollPath }
    // Retrieve any existing cookie
    var cookie = req.signedCookies['user'];
    // Check if cookie exists and create one if not
    if ( !cookie ) {
      value = makeid();
      res.cookie('user', value, {signed: true})
      cookie = req.signedCookies['user'];
    }

    // Look for the object by the path given
    var poll = Poll.findOne(pollPath).populate('thoughts').exec(function(err, poll) {
      if (err) {
        console.log(err);
      }
      else {
        // If no pre-existing poll then create a new one
        if ( !poll ) {
          var newPoll = new Poll(pollPath)
          // Add the current user's cookie to the participants attribute
          newPoll.participants.push(cookie);
          newPoll.path = pollPath.path;
          newPoll.save(function (err) {
            if (err) {console.log(err)}
            else {
              res.format({
                html: () => {res.render('poll-show'), {poll: newPoll} },
                json: () => {res.json(newPoll)}
              })
            }
          });

        } else {
          if (!poll.creator){
            poll.creator = cookie;
          }

          var contained = checkAvailability(poll.participants, cookie);
          if (contained === false) {
            poll.participants.push(cookie)
          }


          var thoughts = poll.thoughts
          if (thoughts) {
            for (var i = 0; i < thoughts.length; i++) {
              thought = thoughts[i]
              thought.setUserContained(cookie)
            }
          }

          poll.save(function (err) {
            if (err) { console.log(err)}
            else {
              res.format({
                html: () => {
                  res.render('poll-show', {poll: poll});
                },
                json: () => {
                  res.json(poll)
                }
              })
            }
          });
        }
      };
    });
  });

  //POLLS INDEX
  app.get('/polls', function(req, res) {
    Poll.find().sort({'_id': -1}).exec(function(err, polls) {
      res.format({
        html: () => {
          res.render('polls-index', { polls: polls});
        },
        json: () => {
          res.json(polls)
        }
      })

    });
  });


  //POLL CREATE
  app.post('/polls/', function (req, res) {
    const format = req.params.format
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
    const format = req.params.format
    var poll = Poll.findById(req.params.id).exec(function(err, poll){
      res.format({
        html: () => {
          res.render('poll-edit', {poll: poll});
        },
        json: () => {
          res.json(poll)
        }
      })

    });
  });

  //POLL UPDATE
  app.put('/:pollId', function(req, res) {
    console.log('new title:' + req.body.title);
    Poll.findOneAndUpdate({ path: req.params.pollId }, req.body).exec(function(err, poll) {
      if (err) { return res.send(err) };
      poll.title = req.body.title;
      console.log('success!---------' + poll.title)
      res.send(poll);
    });
  });
};
