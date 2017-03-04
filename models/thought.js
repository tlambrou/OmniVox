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

var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var slugify = require('slugify')

var ThoughtSchema = new Schema({
  createdAt     : { type: Date }
  , updatedAt     : { type: Date }

  , description   : { type: String, required: true }
  , voters        : [String]
  , votes         : { type: Number }
  , voteWidth     : { type: Number }
  , userContained : { type: Boolean }
  , creator       : { type: String }
  // , user          : { type: String, required: true }
  // , post          : { type: Schema.Types.ObjectId, ref: 'Post' }

})

ThoughtSchema.statics.highest = function highest (votes, voters) {

  // return this.where('name', new RegExp(name, 'i')).exec(cb);
}

// SET createdAt and updatedAt
ThoughtSchema.pre('save', function(next) {
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }

  if (!this.voters){
    this.votes = 0
  } else {
    voters = this.voters
    console.log("voters: " + voters)
    this.votes = voters.length
  }

  // var cookie = Cookies.get('user');
  //
  // if ( !cookie ) {
  //   value = makeid();
  //   Cookies.set('user', value, { expires: 3, path: '' });
  // }
  next();
});

ThoughtSchema.post('save', function(doc) {
  if (!this.voters){
    this.votes = 0
  } else {
    voters = this.voters
    this.votes = voters.length
  }
  console.log('%s has been saved', doc._id);
});

ThoughtSchema.methods.setUserContained = function setUserContained (cookie) {
  var contained = checkAvailability(this.voters, cookie);
  if (contained === true) {
    this.userContained = true
  } else if (contained === false) {
    this.userContained = false
  }
  return contained
}


var Thought = mongoose.model('Thought', ThoughtSchema)

module.exports = Thought;
