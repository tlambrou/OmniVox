var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }

  , title     : { type: String, required: true }
  , category  : { type: String }
  , content   : { type: String, required: true }
  , comments  : [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})


// SET createdAt and updatedAt
PostSchema.pre('save', function(next) {
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
