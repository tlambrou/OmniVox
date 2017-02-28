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

var PollSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }

  , title         : { type: String, }
  , description   : { type: String }
  , path          : { type: String, required: true, unique: true }

  , creator       : String
  , thoughts      : [{ type: Schema.Types.ObjectId, ref: 'Thought' }]
  , users         : [{ type: Schema.Types.ObjectId, ref: 'User' }]
  , moderator     : { type: Schema.Types.ObjectId, ref: 'User' }
})

// SET createdAt and updatedAt
PollSchema.pre('save', function(next) {
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  if ( !this.title ) {
    this.title = this.path
  }

  next();
});

var Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;
