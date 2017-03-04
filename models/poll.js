function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

var mongoose = require('mongoose')
var slugify = require('slugify')
var moment = require('moment');

var Schema = mongoose.Schema;

var PollSchema = new Schema({
  createdAt         : { type: Date }
  , updatedAt         : { type: Date }
  , updatedAtTime     : { type: Number }
  , updatedAtFromNow  : { type: String }
  , title             : { type: String, default: '' }
  , description       : { type: String }
  , path              : { type: String, required: true, unique: true }
  , highestVote       : { type: Number }

  , creator           : { type: String}
  , participants      : [String]
  , thoughts          : [{ type: Schema.Types.ObjectId, ref: 'Thought' }]
  , users             : [{ type: Schema.Types.ObjectId, ref: 'User' }]
  , moderator         : { type: Schema.Types.ObjectId, ref: 'User' }
})

// SET createdAt and updatedAt

PollSchema.pre('save', function(next) {
  now = new Date();
  this.updatedAt = now;
  this.updatedAtTime = now.getTime()

  if ( !this.createdAt ) {
    this.createdAt = now;
  }

  // Find the highest vote value for any thought
  this.highestVote = this.highest()

  var mmnt = moment(this.updatedAt);
  this.updatedAtFromNow = mmnt.fromNow();
  // if ( !this.title ) {
  //   this.title = this.path
  // }
  next();
});

PollSchema.methods.highest = function highest () {

  var highest = 0;
  thoughts = this.thoughts
  for (var i = 0; i < thoughts.length; i++) {
    thought = this.thoughts[i]
    var length = 0
    if (thought.voters) {
      length = thought.voters.length
    }
    if (length > highest) {
      highest = length
    }

  }

  for (var i = 0; i < thoughts.length; i++) {
    thought = this.thoughts[i]
    if (thought.votes) {

      thought.voteWidth = (highest / thought.votes) * 100
    } else {
      thought.voteWidth = 0
    }
  }
  return highest
}

// PollSchema.statics.fromNow = function fromNow (date) {
//   var mmnt = moment(date);
//   return mmnt.fromNow();
// }

var Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;
