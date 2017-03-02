function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var slugify = require('slugify')

var ThoughtSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }

  , description   : { type: String, required: true }
  , votes         : [String]
  , creator       : String
  // , user          : { type: String, required: true }
  // , post          : { type: Schema.Types.ObjectId, ref: 'Post' }

})

// SET createdAt and updatedAt
ThoughtSchema.pre('save', function(next) {
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }

  // var cookie = Cookies.get('user');
  //
  // if ( !cookie ) {
  //   value = makeid();
  //   Cookies.set('user', value, { expires: 3, path: '' });
  // }
  next();
});

var Thought = mongoose.model('Thought', ThoughtSchema)

module.exports = Thought;
