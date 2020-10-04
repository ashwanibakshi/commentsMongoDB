var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    comment:String
});

var articleSchema = new mongoose.Schema({
   article:String,
   comment:[commentSchema]
});

module.exports = mongoose.model('articles',articleSchema);