var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id: Schema.ObjectId,
  name:String,
  email:String,
  password:String
});

mongoose.model('user', userSchema)