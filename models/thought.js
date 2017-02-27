var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ThoughtSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }

  , description   : { type: String, required: true }
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
  next();
});

var Thought = mongoose.model('Thought', ThoughtSchema)

module.exports = Thought;
